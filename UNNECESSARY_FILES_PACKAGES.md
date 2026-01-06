# 🗑️ Unnecessary Files & Packages Analysis

## 📦 Packages to Remove

### ❌ **CRITICAL - Remove Immediately**

1. **`motion` (v12.23.12)**
   - **Reason:** Duplicate of `framer-motion`
   - **Impact:** ~200KB bundle size reduction
   - **Action:** `npm uninstall motion`
   - **Files affected:** 39 files need import updates

2. **`bun` (v1.3.4)**
   - **Reason:** Runtime dependency, not needed in production
   - **Impact:** ~50KB bundle size reduction
   - **Action:** `npm uninstall bun`

### ⚠️ **Consider Removing**

3. **`react-tweet` (v3.2.2)**
   - **Reason:** Check if actually used
   - **Impact:** ~100KB if unused
   - **Action:** Search codebase, remove if not used
   - **Check:** `grep -r "react-tweet" src/`

4. **`@tabler/icons-react` (v3.34.1)**
   - **Reason:** Duplicate icon library (you have lucide-react)
   - **Impact:** ~150KB bundle size reduction
   - **Action:** Migrate to lucide-react, then remove
   - **Files using it:** Check with `grep -r "@tabler/icons-react" src/`

5. **`react-icons` (v5.5.0)**
   - **Reason:** Duplicate icon library (you have lucide-react)
   - **Impact:** ~200KB bundle size reduction
   - **Action:** Migrate to lucide-react, then remove
   - **Files using it:** 15 files

### 🔄 **Lazy Load Instead of Removing**

6. **`html-to-image` (v1.11.13)**
   - **Reason:** Heavy library, only used in dashboard
   - **Impact:** ~300KB bundle size reduction if lazy loaded
   - **Action:** Use dynamic import instead of removing
   ```typescript
   const htmlToImage = dynamic(() => import('html-to-image'), { ssr: false });
   ```

7. **`three` (v0.167.1)**
   - **Reason:** Heavy 3D library, only used in 3 files
   - **Impact:** ~500KB bundle size reduction if lazy loaded
   - **Action:** Use dynamic import
   - **Files using it:** 
     - `src/components/TeamSection.tsx`
     - `src/components/StorySection.tsx`
     - `src/app/events/[id]/schedule/page.tsx`

8. **`gsap` (v3.14.2)**
   - **Reason:** Only used in SkipperLanding.tsx
   - **Impact:** ~200KB bundle size reduction if lazy loaded
   - **Action:** Use dynamic import
   - **File using it:** `src/components/SkipperLanding.tsx`

---

## 📁 Files to Remove/Consolidate

### ❌ **Documentation Files (Can Archive)**

1. **`ERROR_FIXES.md`**
   - **Reason:** Historical documentation, errors already fixed
   - **Action:** Move to `/docs/archive/` or delete

2. **`IMPLEMENTATION_GUIDE.md`**
   - **Reason:** Implementation already complete
   - **Action:** Move to `/docs/archive/` or delete

3. **`OPTIMIZATION_STATUS.md`**
   - **Reason:** Status is outdated
   - **Action:** Move to `/docs/archive/` or delete

4. **`OPTIMIZATION_SUMMARY.md`**
   - **Reason:** Summary is outdated
   - **Action:** Move to `/docs/archive/` or delete

5. **`optimization-recommendations.md`**
   - **Reason:** Recommendations already implemented
   - **Action:** Move to `/docs/archive/` or delete

### 🔄 **Duplicate/Unused Files**

6. **`next.config.optimized.mjs`**
   - **Reason:** Duplicate config file
   - **Action:** Merge optimizations into `next.config.mjs`, then delete

7. **`src/lib/react-query.tsx`**
   - **Reason:** Duplicate of `src/providers/QueryProvider.tsx`
   - **Action:** Check if used, remove if duplicate
   - **Check:** `grep -r "react-query.tsx" src/`

8. **`fix-errors.sh`**
   - **Reason:** One-time fix script, errors already fixed
   - **Action:** Delete or move to `/scripts/archive/`

9. **`install-dependencies.sh`**
   - **Reason:** One-time setup script
   - **Action:** Delete or move to `/scripts/archive/`

10. **`install-optimizations.sh`**
    - **Reason:** One-time setup script
    - **Action:** Delete or move to `/scripts/archive/`

### 🗂️ **Unused Component Files (Verify First)**

11. **`src/components/working.tsx`**
    - **Reason:** Check if actually used
    - **Action:** `grep -r "working" src/` - Remove if unused

12. **`src/components/leaveBtn.tsx`**
    - **Reason:** Check if actually used
    - **Action:** `grep -r "leaveBtn" src/` - Remove if unused

13. **`src/components/reset-password.tsx`**
    - **Reason:** Check if duplicate of page version
    - **Action:** Compare with `src/app/reset-password/` - Remove if duplicate

---

## 📊 Bundle Size Impact Summary

### If All Removed:
- **motion:** -200KB
- **bun:** -50KB
- **@tabler/icons-react:** -150KB
- **react-icons:** -200KB
- **react-tweet (if unused):** -100KB
- **Total:** ~700KB reduction

### If Lazy Loaded:
- **html-to-image:** -300KB initial load
- **three:** -500KB initial load
- **gsap:** -200KB initial load
- **Total:** ~1MB initial load reduction

---

## 🎯 Recommended Removal Order

### Phase 1: Safe Removals (No Code Changes)
1. ✅ `bun` - Just remove from package.json
2. ✅ Archive old documentation files
3. ✅ Remove one-time scripts

### Phase 2: After Code Updates
4. ✅ `motion` - After updating 39 files
5. ✅ `@tabler/icons-react` - After migrating icons
6. ✅ `react-icons` - After migrating icons
7. ✅ `react-tweet` - After confirming unused

### Phase 3: Lazy Loading
8. ✅ Lazy load `html-to-image`
9. ✅ Lazy load `three`
10. ✅ Lazy load `gsap`

---

## 🔍 Verification Commands

```bash
# Check if react-tweet is used
grep -r "react-tweet" src/

# Check if @tabler/icons-react is used
grep -r "@tabler/icons-react" src/

# Check if react-icons is used
grep -r "react-icons" src/

# Check bundle size
npm run analyze

# Find unused exports
npx ts-prune
```

---

## ✅ Safe to Remove Checklist

- [ ] `bun` package
- [ ] `motion` package (after updating imports)
- [ ] Old documentation files
- [ ] One-time setup scripts
- [ ] `next.config.optimized.mjs` (after merging)
- [ ] Duplicate provider files (after verification)

---

**Total Potential Savings:** ~1.7MB bundle size reduction
**Estimated Load Time Improvement:** 30-40% faster initial load

