// import { Product, Review } from '@/types';
// import { categories } from './categories';

// const sampleReviews: Review[] = [
//   { id: 'r1', userName: 'Priya Sharma', userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5, comment: 'Absolutely stunning decoration! Made our wedding day magical.', date: '2025-05-12' },
//   { id: 'r2', userName: 'Rajesh Kumar', userAvatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5, comment: 'Premium quality and professional service. Highly recommend!', date: '2025-04-28' },
//   { id: 'r3', userName: 'Anita Desai', userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 4, comment: 'Beautiful setup, slightly delayed delivery but worth it.', date: '2025-06-03' },
//   { id: 'r4', userName: 'Vikram Singh', userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5, comment: 'The chandeliers were breathtaking. Guests were amazed!', date: '2025-05-19' },
//   { id: 'r5', userName: 'Meera Iyer', userAvatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5, comment: 'Best tent house in the city. Flawless execution.', date: '2025-06-11' },
// ];

// const productTemplates: Record<string, { names: string[]; basePrice: number; images: string[] }[]> = {};

// categories.forEach((cat) => {
//   productTemplates[cat.id] = [
//     {
//       names: [`Premium ${cat.name}`, `Luxury ${cat.name} Set`, `Deluxe ${cat.name}`, `Royal ${cat.name} Package`, `Classic ${cat.name}`],
//       basePrice: 15000,
//       images: [
//         cat.image,
//         `https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800`,
//         `https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800`,
//       ],
//     },
//     {
//       names: [`Standard ${cat.name}`, `Economy ${cat.name}`, `Basic ${cat.name} Kit`],
//       basePrice: 8000,
//       images: [
//         `https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800`,
//         cat.image,
//       ],
//     },
//   ];
// });

// function generateProducts(): Product[] {
//   const products: Product[] = [];
//   let idCounter = 1;

//   categories.forEach((cat) => {
//     const templates = productTemplates[cat.id];
//     const count = Math.min(cat.productCount, 8);
//     for (let i = 0; i < count; i++) {
//       const template = templates[i % templates.length];
//       const name = template.names[i % template.names.length];
//       const basePrice = template.basePrice + (i * 1500);
//       const originalPrice = Math.round(basePrice * 1.25);
//       const discount = Math.round(((originalPrice - basePrice) / originalPrice) * 100);
//       const rating = Number((4.2 + (i % 8) * 0.1).toFixed(1));
//       const reviewCount = 12 + (i * 7) % 80;

//       products.push({
//         id: `p${idCounter++}`,
//         name,
//         categoryId: cat.id,
//         categoryName: cat.name,
//         price: basePrice,
//         originalPrice,
//         discount,
//         rating: Math.min(rating, 5),
//         reviewCount,
//         images: template.images,
//         description: `Experience the finest ${cat.name.toLowerCase()} with our premium ${name}. Crafted with attention to detail, this product brings elegance and luxury to your special occasions. Perfect for weddings, receptions, corporate events, and celebrations.`,
//         features: [
//           'Premium quality materials',
//           'Professional installation included',
//           'Customizable to your theme',
//           'Durable and long-lasting',
//           'Easy to maintain',
//         ],
//         specifications: [
//           { label: 'Material', value: 'Premium Grade' },
//           { label: 'Dimensions', value: 'Varies by design' },
//           { label: 'Color', value: 'As shown' },
//           { label: 'Installation', value: 'Included' },
//           { label: 'Rental Period', value: '1-3 days' },
//         ],
//         colors: ['#2E4374', '#D4A82E', '#9B2D5C', '#FFFFFF'],
//         inStock: i % 7 !== 0,
//         stockCount: (i % 5) * 3 + 2,
//         isTrending: i % 3 === 0,
//         isBestSeller: i % 4 === 0,
//         isNewArrival: i % 5 === 0,
//         reviews: sampleReviews.slice(0, (i % 3) + 2),
//         relatedIds: [],
//       });
//     }
//   });

//   // Wire up related products within same category
//   products.forEach((p) => {
//     p.relatedIds = products
//       .filter((x) => x.categoryId === p.categoryId && x.id !== p.id)
//       .slice(0, 4)
//       .map((x) => x.id);
//   });

//   return products;
// }

// export const products: Product[] = generateProducts();

// export function getProductsByCategory(categoryId: string): Product[] {
//   return products.filter((p) => p.categoryId === categoryId);
// }

// export function getProductById(id: string): Product | undefined {
//   return products.find((p) => p.id === id);
// }

// export function getTrendingProducts(): Product[] {
//   return products.filter((p) => p.isTrending).slice(0, 10);
// }

// export function getBestSellers(): Product[] {
//   return products.filter((p) => p.isBestSeller).slice(0, 10);
// }

// export function getNewArrivals(): Product[] {
//   return products.filter((p) => p.isNewArrival).slice(0, 10);
// }

// export function searchProducts(query: string): Product[] {
//   const q = query.toLowerCase();
//   return products.filter(
//     (p) => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q)
//   );
// }



// mock/products.ts
import { Product, Review } from '@/types';
import { categories } from './categories';

const sampleReviews: Review[] = [
  { id: 'r1', userName: 'Priya Sharma', userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5, comment: 'Absolutely stunning decoration! Made our wedding day magical.', date: '2025-05-12' },
  { id: 'r2', userName: 'Rajesh Kumar', userAvatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5, comment: 'Premium quality and professional service. Highly recommend!', date: '2025-04-28' },
  { id: 'r3', userName: 'Anita Desai', userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 4, comment: 'Beautiful setup, slightly delayed delivery but worth it.', date: '2025-06-03' },
  { id: 'r4', userName: 'Vikram Singh', userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5, comment: 'The chandeliers were breathtaking. Guests were amazed!', date: '2025-05-19' },
  { id: 'r5', userName: 'Meera Iyer', userAvatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5, comment: 'Best tent house in the city. Flawless execution.', date: '2025-06-11' },
];

const productTemplates: Record<string, { names: string[]; basePrice: number; images: string[] }[]> = {};

categories.forEach((cat) => {
  productTemplates[cat.id] = [
    {
      names: [`Premium ${cat.name}`, `Luxury ${cat.name} Set`, `Deluxe ${cat.name}`, `Royal ${cat.name} Package`, `Classic ${cat.name}`],
      basePrice: 15000,
      images: [
        cat.image,
        `https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800`,
        `https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800`,
      ],
    },
    {
      names: [`Standard ${cat.name}`, `Economy ${cat.name}`, `Basic ${cat.name} Kit`],
      basePrice: 8000,
      images: [
        `https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800`,
        cat.image,
      ],
    },
  ];
});

function generateProducts(): Product[] {
  const products: Product[] = [];
  let idCounter = 1;

  categories.forEach((cat) => {
    const templates = productTemplates[cat.id];
    const count = Math.min(cat.productCount, 8);
    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      const name = template.names[i % template.names.length];
      const basePrice = template.basePrice + (i * 1500);
      const originalPrice = Math.round(basePrice * 1.25);
      const discount = Math.round(((originalPrice - basePrice) / originalPrice) * 100);
      const rating = Number((4.2 + (i % 8) * 0.1).toFixed(1));
      const reviewCount = 12 + (i * 7) % 80;

      products.push({
        id: `p${idCounter++}`,
        name,
        categoryId: cat.id,
        categoryName: cat.name,
        price: basePrice,
        originalPrice,
        discount,
        rating: Math.min(rating, 5),
        reviewCount,
        images: template.images,
        description: `Experience the finest ${cat.name.toLowerCase()} with our premium ${name}. Crafted with attention to detail, this product brings elegance and luxury to your special occasions. Perfect for weddings, receptions, corporate events, and celebrations.`,
        features: [
          'Premium quality materials',
          'Professional installation included',
          'Customizable to your theme',
          'Durable and long-lasting',
          'Easy to maintain',
        ],
        specifications: [
          { label: 'Material', value: 'Premium Grade' },
          { label: 'Dimensions', value: 'Varies by design' },
          { label: 'Color', value: 'As shown' },
          { label: 'Installation', value: 'Included' },
          { label: 'Rental Period', value: '1-3 days' },
        ],
        colors: ['#2E4374', '#D4A82E', '#9B2D5C', '#FFFFFF'],
        sizes: ['Standard', 'Large', 'Extra Large'],
        inStock: i % 7 !== 0,
        stockCount: (i % 5) * 3 + 2,
        soldCount: (i % 4) * 5 + 10,
        isTrending: i % 3 === 0,
        isBestSeller: i % 4 === 0,
        isFeatured: i % 5 === 0, // Use isFeatured instead of isNewArrival
        brand: 'Super Tent House',
        weight: 'Varies',
        dimensions: 'Varies by design',
        material: 'Premium Grade',
        careInstructions: 'Professional cleaning recommended',
        warranty: '1 year manufacturer warranty',
        returnPolicy: '30 days return policy',
        shippingInfo: 'Free shipping on orders above ₹500',
        reviews: sampleReviews.slice(0, (i % 3) + 2),
        relatedIds: [],
        color_images: {},
      });
    }
  });

  // Wire up related products within same category
  products.forEach((p) => {
    p.relatedIds = products
      .filter((x) => x.categoryId === p.categoryId && x.id !== p.id)
      .slice(0, 4)
      .map((x) => x.id);
  });

  return products;
}

export const products: Product[] = generateProducts();

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getTrendingProducts(): Product[] {
  return products.filter((p) => p.isTrending).slice(0, 10);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller).slice(0, 10);
}

export function getNewArrivals(): Product[] {
  // Use isFeatured as a proxy for new arrivals since isNewArrival doesn't exist
  return products.filter((p) => p.isFeatured).slice(0, 10);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q)
  );
}