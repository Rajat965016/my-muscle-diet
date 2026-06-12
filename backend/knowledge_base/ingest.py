import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from knowledge_base.loader import KnowledgeBaseLoader

if __name__ == "__main__":
    loader = KnowledgeBaseLoader()
    loader.ingest_all()
    
    print("\n" + "="*50)
    print("TESTING QUERIES")
    print("="*50)
    
    test_queries = [
        "high protein veg breakfast low budget north india summer",
        "post workout meal evening gym bulking diet",
        "low budget protein sources middle class indian gym",
        "winter diet rules for muscle building india",
        "soya chunks protein content and preparation"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Query: {query}")
        result = loader.query(query, n_results=2)
        print(f"Result: {result[:300]}...")
        print("-" * 40)
    
    print("\n✅ Knowledge base is ready!")
