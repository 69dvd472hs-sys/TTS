/**
 * Shopify Storefront API Service
 */

const DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Celestial Oversized Hoodie",
    handle: "celestial-oversized-hoodie",
    description: "Heavyweight 450GSM cotton fleece hoodie with a relaxed, dropped shoulder fit. Features an orbital embroidery on the chest and reflective 'TOUCH THE STARS' back print.",
    priceRange: {
      minVariantPrice: { amount: "120.00", currencyCode: "USD" }
    },
    images: {
      edges: [
        { node: { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000", altText: "Hoodie" } }
      ]
    },
    variants: {
      edges: [{ node: { id: "v1", title: "Default Title" } }]
    }
  },
  {
    id: "2",
    title: "Asteroid Mesh Shorts",
    handle: "asteroid-mesh-shorts",
    description: "Double-layered heavyweight mesh shorts with deep pockets and custom drawstring hardware. Designed for the streets of neo-tokyo.",
    priceRange: {
      minVariantPrice: { amount: "65.00", currencyCode: "USD" }
    },
    images: {
      edges: [
        { node: { url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=1000", altText: "Shorts" } }
      ]
    },
    variants: {
      edges: [{ node: { id: "v2", title: "Default Title" } }]
    }
  },
  {
    id: "3",
    title: "Gravitational Cargo Pants",
    handle: "gravitational-cargo-pants",
    description: "Multi-pocket tactical trousers crafted from durable ripstop nylon. Adjustable toggles at the ankle for preferred silhouette.",
    priceRange: {
      minVariantPrice: { amount: "145.00", currencyCode: "USD" }
    },
    images: {
      edges: [
        { node: { url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=1000", altText: "Cargos" } }
      ]
    },
    variants: {
      edges: [{ node: { id: "v3", title: "Default Title" } }]
    }
  },
  {
    id: "4",
    title: "Supernova Graphic Tee",
    handle: "supernova-graphic-tee",
    description: "Premium jersey cotton tee with a screen-printed supernova graphic. Pre-shrunk and vintage washed for a superior hand-feel.",
    priceRange: {
      minVariantPrice: { amount: "55.00", currencyCode: "USD" }
    },
    images: {
      edges: [
        { node: { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000", altText: "Tee" } }
      ]
    },
    variants: {
      edges: [{ node: { id: "v4", title: "Default Title" } }]
    }
  }
];

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
      };
    }[];
  };
}

const PRODUCTS_QUERY = `
  {
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchProducts(): Promise<ShopifyProduct[]> {
  if (!DOMAIN || !ACCESS_TOKEN) {
    console.warn("Shopify credentials missing. Using mock data.");
    return MOCK_PRODUCTS;
  }

  try {
    const response = await fetch(`https://${DOMAIN}/api/2023-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY }),
    });

    const { data } = await response.json();
    return data.products.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error("Error fetching Shopify products:", error);
    return MOCK_PRODUCTS;
  }
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  if (!DOMAIN || !ACCESS_TOKEN) {
    return MOCK_PRODUCTS.find(p => p.handle === handle) || null;
  }

  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${DOMAIN}/api/2023-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables: { handle } }),
    });

    const { data } = await response.json();
    return data.product;
  } catch (error) {
    console.error("Error fetching Shopify product:", error);
    return MOCK_PRODUCTS.find(p => p.handle === handle) || null;
  }
}
