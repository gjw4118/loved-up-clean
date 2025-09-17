# 🌱 Database Seeding Guide

## 🎯 **What This Does**

The seeding script populates your Supabase database with:
- **4 Question Decks** (Friends, Family, Romantic, Professional)
- **40+ Sample Questions** (10 per deck)
- **Proper categorization** and difficulty levels

## 🔧 **Setup Required**

### **1. Environment Variables**

Create a `.env.local` file in your project root:

```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the URL and anon key

### **2. Database Schema**

Make sure your Supabase database has the required tables. The schema is in:
`lib/database/schema.sql`

**To apply the schema:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `schema.sql`
3. Run the query

## 🚀 **Running the Seeder**

### **Option 1: With Environment File**
```bash
npm run seed
```

### **Option 2: With Inline Environment Variables**
```bash
EXPO_PUBLIC_SUPABASE_URL=your-url EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key npm run seed
```

## 📊 **Expected Output**

When successful, you should see:

```
🌱 Starting database seeding...
🎯 Seeding question decks...
✅ Successfully seeded 4 question decks
❓ Seeding questions...
✅ Seeded batch 1/4
✅ Seeded batch 2/4
✅ Seeded batch 3/4
✅ Seeded batch 4/4
✅ Successfully seeded 40 questions
🔍 Verifying seeding results...
📊 Deck Summary:
  - Friends & Social: 10 questions
  - Family Bonds: 10 questions
  - Love & Romance: 10 questions
  - Work & Growth: 10 questions
📈 Total active questions: 40
🎉 Database seeding completed successfully!
✅ Seeding script completed
```

## 🔍 **Verify in Supabase**

After seeding, check your Supabase dashboard:

1. **Table Editor** → `question_decks` (should have 4 rows)
2. **Table Editor** → `questions` (should have 40+ rows)

## 🐛 **Troubleshooting**

### **Error: Missing Environment Variables**
```
❌ Please set your SUPABASE_URL in environment variables
```
**Solution**: Create `.env.local` file with your Supabase credentials

### **Error: Table doesn't exist**
```
relation "question_decks" does not exist
```
**Solution**: Apply the database schema from `lib/database/schema.sql`

### **Error: RLS Policy**
```
new row violates row-level security policy
```
**Solution**: The seeding script uses the anon key, which should work with the RLS policies in the schema

## 🎯 **Next Steps**

After successful seeding:

1. **Test the app** - Your decks screen should now show real data
2. **Browse questions** - Select a deck to see the seeded questions
3. **Create development build** - Test on your device

---

**Ready to seed!** Make sure you have your Supabase credentials and run `npm run seed`.
