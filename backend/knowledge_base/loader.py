import os
import json
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document

BASE_DIR = Path(__file__).parent

class KnowledgeBaseLoader:
    
    CHROMA_PATH = str(BASE_DIR / "chroma_db")
    PDF_FOLDER = str(BASE_DIR / "pdfs")
    JSON_FOLDER = str(BASE_DIR / "json")
    PLANS_FOLDER = str(BASE_DIR / "expert_plans")
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    
    def __init__(self):
        print("Loading embedding model...")
        self.embeddings = HuggingFaceEmbeddings(
            model_name=self.EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True}
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separators=["\n\n", "\n", ".", " "]
        )
    
    def load_pdfs(self):
        documents = []
        pdf_dir = Path(self.PDF_FOLDER)
        if not pdf_dir.exists():
            print("No PDFs folder found, skipping...")
            return documents
        
        for pdf_file in pdf_dir.glob("*.pdf"):
            print(f"Loading PDF: {pdf_file.name}")
            try:
                loader = PyPDFLoader(str(pdf_file))
                pages = loader.load()
                chunks = self.text_splitter.split_documents(pages)
                for chunk in chunks:
                    chunk.metadata["source_type"] = "official_guideline"
                    chunk.metadata["file"] = pdf_file.name
                documents.extend(chunks)
                print(f"  → {len(chunks)} chunks from {pdf_file.name}")
            except Exception as e:
                print(f"  → Error loading {pdf_file.name}: {e}")
        
        return documents
    
    def load_json_files(self):
        documents = []
        json_dir = Path(self.JSON_FOLDER)
        
        # Load nutrition_data.json
        nutrition_file = json_dir / "nutrition_data.json"
        if nutrition_file.exists():
            with open(nutrition_file) as f:
                data = json.load(f)
            for food in data.get("foods", []):
                text = f"""
                Food: {food['name']}
                Protein per 100g: {food['per_100g']['protein']}g
                Calories per 100g: {food['per_100g']['calories']} kcal
                Carbs: {food['per_100g']['carbs']}g
                Category: {food['category']}
                Budget: {food.get('budget', 'any')}
                Availability: {food.get('availability', 'common')}
                Portions: {json.dumps(food.get('common_portions', []))}
                """
                doc = Document(
                    page_content=text.strip(),
                    metadata={
                        "source_type": "nutrition_data",
                        "food_name": food['name'],
                        "category": food.get('category', ''),
                        "budget": food.get('budget', 'any')
                    }
                )
                documents.append(doc)
            print(f"Loaded {len(data['foods'])} foods from nutrition_data.json")
        
        # Load regional_foods.json
        regional_file = json_dir / "regional_foods.json"
        if regional_file.exists():
            with open(regional_file) as f:
                regions = json.load(f)
            for region_data in regions:
                region_name = region_data['region']
                for season, budgets in region_data['seasons'].items():
                    for budget_level, budget_data in budgets.items():
                        foods_text = json.dumps(
                            budget_data.get('top_protein_foods', []), 
                            indent=2
                        )
                        text = f"""
                        Region: {region_name}
                        Cities: {', '.join(region_data['cities'])}
                        Season: {season}
                        Budget: {budget_level}
                        Available protein foods and prices:
                        {foods_text}
                        Avoid in this season: 
                        {', '.join(budget_data.get('avoid_in_season', []))}
                        Recommended extras: 
                        {', '.join(budget_data.get('recommended_extras', []))}
                        """
                        doc = Document(
                            page_content=text.strip(),
                            metadata={
                                "source_type": "regional_foods",
                                "region": region_name,
                                "season": season,
                                "budget": budget_level
                            }
                        )
                        documents.append(doc)
            print(f"Loaded regional food data for {len(regions)} regions")
        
        # Load seasonal_rules.json
        seasonal_file = json_dir / "seasonal_rules.json"
        if seasonal_file.exists():
            with open(seasonal_file) as f:
                data = json.load(f)
            for season, rules in data['india_seasons'].items():
                text = f"""
                Season: {season}
                Months: {', '.join(rules['months'])}
                Temperature: {rules.get('temp_celsius', 'varies')}°C
                Diet rules for this season:
                {chr(10).join(rules['diet_rules'])}
                Best protein sources in {season}:
                {', '.join(rules['best_protein_sources'])}
                """
                doc = Document(
                    page_content=text.strip(),
                    metadata={
                        "source_type": "seasonal_rules",
                        "season": season
                    }
                )
                documents.append(doc)
            print(f"Loaded seasonal rules for {len(data['india_seasons'])} seasons")
        
        return documents
    
    def load_expert_plans(self):
        documents = []
        plans_dir = Path(self.PLANS_FOLDER)
        if not plans_dir.exists():
            print("No expert plans folder, skipping...")
            return documents
        
        for txt_file in plans_dir.glob("*.txt"):
            with open(txt_file) as f:
                content = f.read()
            chunks = self.text_splitter.split_text(content)
            for chunk in chunks:
                doc = Document(
                    page_content=chunk,
                    metadata={
                        "source_type": "expert_plan",
                        "file": txt_file.name
                    }
                )
                documents.append(doc)
            print(f"Loaded {len(chunks)} chunks from {txt_file.name}")
        
        return documents
    
    def ingest_all(self):
        print("\n" + "="*50)
        print("KNOWLEDGE BASE INGESTION STARTING")
        print("="*50)
        
        all_documents = []
        all_documents.extend(self.load_pdfs())
        all_documents.extend(self.load_json_files())
        all_documents.extend(self.load_expert_plans())
        
        print(f"\nTotal documents to ingest: {len(all_documents)}")
        print("Creating ChromaDB collection...")
        
        vectorstore = Chroma.from_documents(
            documents=all_documents,
            embedding=self.embeddings,
            persist_directory=self.CHROMA_PATH,
            collection_name="diet_knowledge"
        )
        vectorstore.persist()
        
        print(f"✅ Ingested {len(all_documents)} chunks into ChromaDB")
        print(f"📁 Stored at: {self.CHROMA_PATH}")
        return vectorstore
    
    def get_vectorstore(self):
        return Chroma(
            persist_directory=self.CHROMA_PATH,
            embedding_function=self.embeddings,
            collection_name="diet_knowledge"
        )
    
    def query(self, question: str, n_results: int = 5) -> str:
        vectorstore = self.get_vectorstore()
        results = vectorstore.similarity_search(question, k=n_results)
        
        formatted = []
        for i, doc in enumerate(results, 1):
            source = doc.metadata.get('source_type', 'unknown')
            formatted.append(
                f"{i}. [{source}]\n{doc.page_content[:300]}"
            )
        
        return "\n\n".join(formatted)
