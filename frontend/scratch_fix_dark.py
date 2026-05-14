import os

directory = '/Users/kabulmobilellc/Downloads/RentalManagementMVP-main/frontend/src'

replacements = {
    'dark:bg-slate-900-container-lowest': 'dark:bg-slate-800',
    'dark:bg-slate-900-container-low': 'dark:bg-slate-800',
    'dark:bg-slate-900-container-high': 'dark:bg-slate-800',
    'dark:bg-slate-900-container': 'dark:bg-slate-800',
    'dark:text-slate-100-variant': 'dark:text-slate-400',
    'dark:bg-slate-900-variant': 'dark:bg-slate-800',
    'dark:border-slate-700/20': 'dark:border-slate-700',
}

files_modified = 0

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx'):
            file_path = os.path.join(root, file)
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            for old, new in replacements.items():
                content = content.replace(old, new)
                
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_modified += 1
                print(f"Fixed {file_path}")

print(f"Total files fixed: {files_modified}")
