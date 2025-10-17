# Insert Options Fix - SCB-42

## Summary
Fixed and verified insert options configuration for **Vertical Image Accordion** and **Subscription Banner** components in the SYNC template.

## Changes Made

### 1. Subscription Banner Folder - Enhanced Insert Options
**File:** `authoring/items/items/templates/items/ccl.templates/click-click-launch/Components/Promos/Subscription Banner Folder/__Standard Values.yml`

**Before:**
```yaml
__Masters: "{D2C0BABB-51E4-4E13-9305-6A1107962413}"
```

**After:**
```yaml
__Masters: |
  {D2C0BABB-51E4-4E13-9305-6A1107962413}  # Subscription Banner
  {A5A83E1E-A63E-4DA3-87D2-25182CED85B7}  # Subscription Banner Folder (nested)
```

**What this means:** Users can now create both Subscription Banner items AND nested folders for better organization.

---

### 2. Vertical Image Accordion - Already Configured ✅
**File:** `authoring/items/items/templates/items/ccl.templates/click-click-launch/Components/Page Content/Vertical Image Accordion Folder/__Standard Values.yml`

**Insert Options (Verified):**
```yaml
__Masters: |
  {22C53A61-7AF2-4CC6-86A5-06E0FDB85EE5}  # Vertical Image Accordion
  {4A019A02-89FB-43BB-8A92-BD02733235A3}  # Vertical Image Accordion Folder (nested)
```

**What this means:** Folder can create accordion components and nested folders.

---

### 3. Vertical Image Accordion Component - Already Configured ✅
**File:** `authoring/items/items/templates/items/ccl.templates/click-click-launch/Components/Page Content/Vertical Image Accordion/__Standard Values.yml`

**Insert Options (Verified):**
```yaml
__Masters: "{E64D342F-E5AA-4233-88C4-58CCD451A7D3}"  # Vertical Accordion Item
```

**What this means:** Each accordion can have multiple accordion item children.

---

## Template ID Reference

| Template Name | Template ID | Purpose |
|---------------|-------------|---------|
| **Vertical Image Accordion Folder** | `4A019A02-89FB-43BB-8A92-BD02733235A3` | Container for accordion components |
| **Vertical Image Accordion** | `22C53A61-7AF2-4CC6-86A5-06E0FDB85EE5` | Accordion component with child items |
| **Vertical Accordion Item** | `E64D342F-E5AA-4233-88C4-58CCD451A7D3` | Individual accordion panel |
| **Subscription Banner Folder** | `A5A83E1E-A63E-4DA3-87D2-25182CED85B7` | Container for subscription banners |
| **Subscription Banner** | `D2C0BABB-51E4-4E13-9305-6A1107962413` | Email subscription component |

---

## How to Apply Changes in XM Cloud

### Option 1: Via Sitecore CLI (Recommended)

1. **Push serialization to XM Cloud:**
   ```bash
   cd authoring
   dotnet sitecore ser push
   ```

2. **Verify the push:**
   - Check for successful sync messages
   - Look for the template paths in the output

3. **Clear cache in XM Cloud:**
   - Login to Content Editor
   - Navigate to: Control Panel → Administration → Clear All Caches
   - Click "Clear all caches"

### Option 2: Manual Verification in Content Editor

1. **Check Template Configuration:**
   - Navigate to: `/sitecore/templates/Project/click-click-launch/Components/Page Content/Vertical Image Accordion Folder/__Standard Values`
   - Switch to "Standard Fields" view (View ribbon)
   - Verify `__Masters` field contains the correct GUIDs

2. **Check in Data Folder:**
   - Navigate to: `/sitecore/content/{your-site}/Data/`
   - Look for "Vertical Image Accordion Folder" or "Subscription Banner Folder"
   - Right-click → Insert → should show available templates

---

## Testing the Fix

### Test 1: Vertical Image Accordion
1. Go to: `/sitecore/content/{your-site}/Data/`
2. Find or create a "Vertical Image Accordion Folder"
3. Right-click the folder → Insert
4. **Expected:** You should see:
   - ✅ Vertical Image Accordion
   - ✅ Vertical Image Accordion Folder

5. Create a "Vertical Image Accordion" item
6. Right-click the accordion item → Insert
7. **Expected:** You should see:
   - ✅ Vertical Accordion Item

### Test 2: Subscription Banner
1. Go to: `/sitecore/content/{your-site}/Data/`
2. Find or create a "Subscription Banner Folder"
3. Right-click the folder → Insert
4. **Expected:** You should see:
   - ✅ Subscription Banner
   - ✅ Subscription Banner Folder (NEW!)

---

## Component Usage in Pages

### Vertical Image Accordion
- **Datasource Location:** `query:$site/*[@@name='Data']/*[@@templatename='Vertical Image Accordion Folder']`
- **Structure:**
  ```
  Data/
    └─ Vertical Image Accordion Folder/
        ├─ My Accordion 1/
        │   ├─ Accordion Item 1
        │   ├─ Accordion Item 2
        │   └─ Accordion Item 3
        └─ My Accordion 2/
            └─ ...
  ```

### Subscription Banner
- **Datasource Location:** `query:$site/*[@@name='Data']/*[@@templatename='Subscription Banner Folder']`
- **Structure:**
  ```
  Data/
    └─ Subscription Banner Folder/
        ├─ Newsletter Signup Banner
        ├─ Product Updates Banner
        └─ Subfolder/ (NEW!)
            └─ Special Campaign Banner
  ```

---

## Troubleshooting

### Issue: "I still don't see insert options"

**Solution 1:** Clear Sitecore cache
- Content Editor → Control Panel → Administration → Clear All Caches

**Solution 2:** Check template inheritance
- Verify your site uses templates that inherit from `click-click-launch` base templates
- Path: `/sitecore/templates/Project/{your-site-collection}/`

**Solution 3:** Verify Data folder template
- Check that your Data folders use the correct folder template
- Right-click folder → "View Item" → check Template field

### Issue: "Components work but can't create nested folders"

**Solution:** Ensure you pushed the latest changes
```bash
cd authoring
dotnet sitecore ser push --force
```

### Issue: "Insert options appear in templates but not in content"

**Solution:** This indicates a permissions or security issue
1. Check user roles and permissions
2. Verify the content item isn't locked by another user
3. Check if the item is in workflow (may restrict insert options)

---

## Rendering Configuration

Both components use these rendering definitions:

### Vertical Image Accordion
- **Path:** `/sitecore/layout/Renderings/Project/click-click-launch/Page Content/Vertical Image Accordion`
- **Component Name:** `VerticalImageAccordion`
- **GraphQL Query:** Includes `children` query for accordion items

### Subscription Banner
- **Path:** `/sitecore/layout/Renderings/Project/click-click-launch/Promos/Subscription Banner`
- **Component Name:** `SubscriptionBanner`
- **Fields:** titleRequired, descriptionOptional, buttonLink, emailPlaceholder

---

## Next Steps

1. ✅ Commit these changes to your feature branch
2. ✅ Push serialization to XM Cloud
3. ✅ Clear cache in Content Editor
4. ✅ Test insert options in Data folders
5. ✅ Verify components render correctly on pages
6. ✅ Create PR for review

---

## Related Files Modified

- `authoring/items/items/templates/items/ccl.templates/click-click-launch/Components/Promos/Subscription Banner Folder/__Standard Values.yml`
- `authoring/items/items/templates/items/ccl.templates/click-click-launch/Components/Page Content/Vertical Image Accordion Folder/__Standard Values.yml` (revision updated)
- `authoring/items/items/templates/items/ccl.templates/click-click-launch/Components/Page Content/Vertical Image Accordion/__Standard Values.yml` (revision updated)

---

## Questions?

If you encounter any issues after applying these changes:
1. Check the Troubleshooting section above
2. Verify serialization sync completed successfully
3. Ensure cache has been cleared in XM Cloud
4. Check Content Editor event logs for errors

