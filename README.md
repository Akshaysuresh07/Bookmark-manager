## Development Journey: Challenges & Solutions

Building **BookmarkHub** involved several technical hurdles that were overcome using modern engineering practices:

### 1. Instant UI Updates vs. Real-time Sync
- **Problem**: Relying solely on real-time subscriptions for UI updates caused a slight delay when adding bookmarks.
- **Solution**: Refactored the architecture to "lift state" to the main Page component. Now, a successful addition triggers an **instant** local refresh while the real-time subscription handles synchronization across other tabs/devices.

### 2. Professional Feature-Based Architecture
- **Problem**: As the app grew, a flat component structure became difficult to maintain.
- **Solution**: Refactored the codebase to follow a **Feature-Based Architecture**. Logic is now encapsulated in `src/features/bookmarks` and `src/features/auth`, using custom hooks (`useBookmarks`) to decouple business logic from the UI.

### 3. Supabase Realtime Replication
- **Problem**: Real-time updates didn't work out of the box after table creation.
- **Solution**: Identified that Supabase requires manual enablement of replication for specific tables. 


## Deployment

### Vercel

1. Push your code to GitHub.
2. Link the repository to a new project on [Vercel](https://vercel.com).
3. Add the following Environment Variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Supabase Configuration

After deploying to Vercel, update your Supabase project settings:
1. **Authentication > URL Configuration**:
   - Set **Site URL** to your Vercel deployment URL (e.g., `https://bookmark-hub.vercel.app`).
   - Add your Vercel URL + `/auth/callback` to the **Redirect URLs**.
2. **Realtime**:
   - Ensure Realtime is enabled for the `bookmarks` table (see `walkthrough.md` for details).