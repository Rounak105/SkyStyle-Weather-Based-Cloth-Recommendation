import os
import json
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = None

try:
    if SUPABASE_URL and SUPABASE_KEY:
        from supabase import create_client, Client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
except ImportError:
    print("Supabase library not found. Using local storage fallback.")

class MockResponse:
    def __init__(self, data):
        self.data = data

# Local storage fallback
# Use a path relative to this file to ensure it's always in the backend directory
LOCAL_STORAGE_FILE = os.path.join(os.path.dirname(__file__), "local_storage.json")

def get_local_storage():
    try:
        if not os.path.exists(LOCAL_STORAGE_FILE):
            print(f"Initializing local storage at {LOCAL_STORAGE_FILE}")
            with open(LOCAL_STORAGE_FILE, "w") as f:
                json.dump({"predictions": [], "wardrobe": []}, f)
        with open(LOCAL_STORAGE_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Local storage read error at {LOCAL_STORAGE_FILE}: {e}")
        return {"predictions": [], "wardrobe": []}

def save_local_storage(data):
    try:
        with open(LOCAL_STORAGE_FILE, "w") as f:
            json.dump(data, f)
    except Exception as e:
        print(f"Local storage save error: {e}")

class LocalTable:
    def __init__(self, table_name):
        self.table_name = table_name
        self.is_delete = False
        self.filter_column = None
        self.filter_value = None
        self.last_inserted = None

    def insert(self, item):
        data = get_local_storage()
        if isinstance(item, dict):
            new_item = item.copy()
            # Generate a unique ID
            existing_ids = [i.get("id", 0) for i in data.get(self.table_name, [])]
            new_item["id"] = max(existing_ids) + 1 if existing_ids else 1
            
            if "created_at" not in new_item:
                from datetime import datetime
                new_item["created_at"] = datetime.now().isoformat()
            
            if self.table_name not in data:
                data[self.table_name] = []
                
            data[self.table_name].append(new_item)
            save_local_storage(data)
            self.last_inserted = new_item
            print(f"Inserted into {self.table_name}: {new_item['id']}")
        return self

    def select(self, *args):
        return self

    def order(self, *args, **kwargs):
        return self

    def limit(self, *args):
        return self

    def execute(self):
        data = get_local_storage()
        table_data = data.get(self.table_name, [])
        
        if self.is_delete and self.filter_column:
            original_count = len(table_data)
            data[self.table_name] = [item for item in table_data if str(item.get(self.filter_column)) != str(self.filter_value)]
            save_local_storage(data)
            print(f"Deleted from {self.table_name}: {original_count - len(data[self.table_name])} items")
            return MockResponse([])
        
        if self.last_inserted:
            res = MockResponse([self.last_inserted])
            self.last_inserted = None
            return res
            
        return MockResponse(table_data)

    def delete(self):
        self.is_delete = True
        return self

    def eq(self, column, value):
        self.filter_column = column
        self.filter_value = value
        return self

class MockSupabase:
    def table(self, name):
        return LocalTable(name)

def get_supabase_client():
    if supabase:
        return supabase
    
    # Return a mock client that uses local storage
    return MockSupabase()
