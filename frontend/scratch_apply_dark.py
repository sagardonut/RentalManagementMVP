import os
import re

directory = '/Users/kabulmobilellc/Downloads/RentalManagementMVP-main/frontend/src'

# Mapping of original classes to their dark equivalents
replacements = {
    r'\bbg-white\b(?!\s+dark:)': 'bg-white dark:bg-slate-900',
    r'\bbg-surface\b(?!\s+dark:)': 'bg-surface dark:bg-slate-900',
    r'\btext-on-surface\b(?!\s+dark:)': 'text-on-surface dark:text-slate-100',
    r'\btext-on-surface-variant\b(?!\s+dark:)': 'text-on-surface-variant dark:text-slate-400',
    r'\bbg-surface-container\b(?!\s+dark:)': 'bg-surface-container dark:bg-slate-800',
    r'\bbg-\[\#FDFDFF\]\b(?!\s+dark:)': 'bg-[#FDFDFF] dark:bg-slate-900',
    
    r'\btext-slate-900\b(?!\s+dark:)': 'text-slate-900 dark:text-white',
    r'\btext-slate-800\b(?!\s+dark:)': 'text-slate-800 dark:text-slate-100',
    r'\btext-slate-700\b(?!\s+dark:)': 'text-slate-700 dark:text-slate-300',
    r'\btext-slate-600\b(?!\s+dark:)': 'text-slate-600 dark:text-slate-400',
    r'\btext-slate-500\b(?!\s+dark:)': 'text-slate-500 dark:text-slate-400',
    # Note: text-slate-400 is often used for secondary text, in dark mode it can stay the same or go darker text-slate-500
    
    r'\bborder-slate-100\b(?!\s+dark:)': 'border-slate-100 dark:border-slate-800',
    r'\bborder-slate-200\b(?!\s+dark:)': 'border-slate-200 dark:border-slate-700',
    
    r'\bbg-slate-50\b(?!\s+dark:)': 'bg-slate-50 dark:bg-slate-800',
    r'\bbg-slate-100\b(?!\s+dark:)': 'bg-slate-100 dark:bg-slate-800',
    
    r'\bhover:bg-slate-50\b(?!\s+dark:)': 'hover:bg-slate-50 dark:hover:bg-slate-800',
    r'\bhover:bg-slate-100\b(?!\s+dark:)': 'hover:bg-slate-100 dark:hover:bg-slate-700',
    r'\bhover:text-slate-600\b(?!\s+dark:)': 'hover:text-slate-600 dark:hover:text-slate-300',
    r'\bhover:text-slate-700\b(?!\s+dark:)': 'hover:text-slate-700 dark:hover:text-slate-200',
}

files_modified = 0

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx'):
            file_path = os.path.join(root, file)
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            for pattern, replacement in replacements.items():
                content = re.sub(pattern, replacement, content)
                
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_modified += 1
                print(f"Updated {file_path}")

print(f"Total files modified: {files_modified}")
