### 🎯 Purpose

The `/purpleStone` folder contains the **Living Documentation** for the Server Heaven project.

It describes, at a conceptual and logical level, how each system, module, and feature works, how they connect, and how they contribute to the overall application experience.

This documentation serves as the single source of truth for understanding, developing, maintaining, and evolving the codebase.

---

### 🏗️ Folder Structure

- Each `.md` file represents a system, module, or key concept.
    
- File names are clear and descriptive, for example:
    
    - `Reputation System.md`
        
    - `Ranking System.md`
        
    - `Moderation API.md`
        
- Documents are interconnected using Obsidian-style links:
    

```md
See also: [[Ranking System]], [[Reputation API]]
```

---

### 🔗 Code Integration

- Code files reference the documents in this folder directly.
    
- The reference pattern is as follows:
    

```python
# Implements [[Reputation System]] (/purpleStone/Reputation System.md)
# Part of [[Ranking System]] (/purpleStone/Ranking System.md)
```

- This allows any developer to quickly understand **where this code fits in the system architecture**.
    

---
### 🔥 Best Practices

- Whenever a new system, module, or feature is created, add a corresponding document here.
    
- Always update the documentation when making relevant changes to the code.
    
- Maintain cross-references between code and documentation.
    

---

### ✅ Status

- Active documentation, continuously evolving. If you find anything outdated, contribute and improve it!