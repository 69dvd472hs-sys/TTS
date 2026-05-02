# How to connect "Touch The Stars" to your Shopify Store

This is a **Headless Storefront** built with React. It connects to your Shopify backend via the Storefront API. It is NOT a standard Liquid theme, so you cannot upload it as a `.zip` in the "Themes" section of Shopify.

## 1. Get your Shopify Storefront API Credentials
1. Go to your Shopify Admin.
2. Click **Settings** > **Apps and sales channels**.
3. Click **Develop apps**.
4. Click **Create an app** (name it "Touch The Stars Storefront").
5. Click **Configuration** and find **Storefront API integration**.
6. Select all relevant scopes (unauthenticated_read_product_listings, etc.).
7. Save and **Install App**.
8. Copy the **Storefront access token**.

## 2. Configure Environment Variables
In this project (or your hosting provider), set these secrets:
- `VITE_SHOPIFY_STORE_DOMAIN`: e.g., `your-store-name.myshopify.com`
- `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`: Your generated token.

## 3. Deployment
- Push this code to GitHub.
- Deploy to a service like **Vercel**, **Netlify**, or **Cloud Run**.
- Your store will now be live at its own URL (e.g., `touchthestars.shop`), pulling real data from Shopify!

## Why Headless?
- **Speed**: Much faster than traditional Shopify themes.
- **Flexibility**: Total creative control over the UI (like the custom streetwear design we built).
- **SEO**: Modern React frameworks offer superior performance metrics.
