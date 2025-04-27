  export  type Product = {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount: number;
    description: string;
    features: string[];
    images: string[];
    colors: { name: string; value: string; inStock: boolean }[];
    sizes: { name: string; inStock: boolean }[];
    stock: number;
    sku: string;
    reviews: {
      id: string;
      user: string;
      rating: number;
      date: string;
      comment: string;
      
    }[];
    categories: string[];
    subcategory: string[];
    brand: string;
    selected?: boolean;
    quantity: number;
    isNew?: boolean
    isFeatured?: boolean
    isOutOfStock?: boolean
      

    specifications: { name: string; value: string }[];
  };

  

const productData: Product[] = [
 
 
    {
        id: "1",
        name: "Premium Comfort T-Shirt",
        price: 29.99,
        originalPrice: 39.99,
        discount: 25,
        description:
          "Our Premium Comfort T-Shirt is made from 100% organic cotton, providing exceptional softness and durability. The breathable fabric ensures comfort throughout the day, while the modern fit flatters all body types. Available in multiple colors and sizes, this versatile piece is perfect for casual outings or can be dressed up for a more polished look.",
        features: ["100% organic cotton", "Breathable fabric", "Modern fit", "Machine washable", "Pre-shrunk material"],
        images: [
          "/Image/User/wallet.png?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
        ],
        colors: [
          { name: "White", value: "#FFFFFF", inStock: true },
          { name: "Black", value: "#000000", inStock: true },
          { name: "Navy", value: "#000080", inStock: true },
          { name: "Gray", value: "#808080", inStock: false },
        ],
        sizes: [
          { name: "XS", inStock: true },
          { name: "S", inStock: true },
          { name: "M", inStock: true },
          { name: "L", inStock: true },
          { name: "XL", inStock: false },
          { name: "XXL", inStock: false },
        ],
        stock: 15,
        sku: "TS-PC-001",
        reviews: [
          {
            id: "1",
            user: "Alex Johnson",
            rating: 5,
            date: "March 15, 2024",
            comment:
              "Absolutely love this shirt! The fabric is so soft and comfortable. I've already ordered two more in different colors.",
          },
          {
            id: "2",
            user: "Sam Taylor",
            rating: 4,
            date: "March 10, 2024",
            comment: "Great quality for the price. Fits as expected and the material feels premium.",
          },
          {
            id: "3",
            user: "Jamie Smith",
            rating: 5,
            date: "March 5, 2024",
            comment: "This is my new favorite t-shirt. The fit is perfect and it washes well without shrinking.",
          },
          {
            id: "4",
            user: "Casey Brown",
            rating: 4,
            date: "February 28, 2024",
            comment:
              "Very comfortable and stylish. The only reason I'm not giving 5 stars is because I wish there were more color options.",
          },
        ],
        specifications: [
          { name: "Material", value: "100% Organic Cotton" },
          { name: "Weight", value: "180 gsm" },
          { name: "Care", value: "Machine wash cold, tumble dry low" },
          { name: "Origin", value: "Made in Portugal" },
          { name: "Fit", value: "Regular fit" },
        ],
        categories: ["Clothing", ],
        subcategory: ["Men's Clothing"],
        brand: "Premium Wear",
        quantity: 1,
      },
      {
        id: "2",
        name: "Eco-Friendly Yoga Pants",
        price: 39.99,
        originalPrice: 49.99,
        discount: 20,
        description:
          "These eco-friendly yoga pants are crafted from recycled materials, ensuring comfort and sustainability. The stretchy fabric allows for a full range of motion during your practice, and the high-waisted design offers support and a flattering silhouette.",
        features: ["Recycled materials", "Stretchy fabric", "High-waisted design", "Breathable", "Machine washable"],
        images: [
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
        ],
        colors: [
          { name: "Black", value: "#000000", inStock: true },
          { name: "Gray", value: "#808080", inStock: true },
          { name: "Teal", value: "#008080", inStock: true },
          { name: "Purple", value: "#800080", inStock: false },
        ],
        sizes: [
          { name: "S", inStock: true },
          { name: "M", inStock: true },
          { name: "L", inStock: true },
          { name: "XL", inStock: false },
        ],
        stock: 25,
        sku: "YP-EF-002",
        reviews: [
          {
            id: "1",
            user: "Chris Lee",
            rating: 5,
            date: "March 12, 2024",
            comment:
              "Love these pants! They're perfect for yoga and super comfortable. The eco-friendly material is a big bonus.",
          },
          {
            id: "2",
            user: "Jordan Carter",
            rating: 4,
            date: "March 8, 2024",
            comment: "Great fit and feel, but the colors are limited. Would love to see more options.",
          },
        ],
        specifications: [
          { name: "Material", value: "Recycled Polyester" },
          { name: "Weight", value: "250 gsm" },
          { name: "Care", value: "Machine wash cold, tumble dry low" },
          { name: "Origin", value: "Made in India" },
          { name: "Fit", value: "High-waisted" },
        ],
        categories: ["Clothing", "T-Shirts"],
        subcategory: ["Men's Clothing"],
        brand: "Premium Wear",
        quantity: 1,
      },
      {
        id: "3",
        name: "Sporty Running Shoes",
        price: 59.99,
        originalPrice: 79.99,
        discount: 25,
        description:
          "These sporty running shoes are designed for high performance and comfort. The lightweight design and cushioned sole ensure a smooth run, while the breathable mesh upper keeps your feet cool and dry.",
        features: ["Lightweight", "Breathable mesh", "Cushioned sole", "Durable rubber outsole", "Perfect for running"],
        images: [
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
        ],
        colors: [
          { name: "Red", value: "#FF0000", inStock: true },
          { name: "Blue", value: "#0000FF", inStock: true },
          { name: "Gray", value: "#808080", inStock: true },
          { name: "Black", value: "#000000", inStock: false },
        ],
        sizes: [
          { name: "8", inStock: true },
          { name: "9", inStock: true },
          { name: "10", inStock: true },
          { name: "11", inStock: false },
        ],
        stock: 10,
        sku: "RS-SR-003",
        reviews: [
          {
            id: "1",
            user: "Patricia O'Connor",
            rating: 5,
            date: "March 18, 2024",
            comment: "These shoes are fantastic for running! They're lightweight, comfortable, and look great.",
          },
        ],
        specifications: [
          { name: "Material", value: "Mesh & Synthetic" },
          { name: "Weight", value: "300g" },
          { name: "Care", value: "Wipe with damp cloth" },
          { name: "Origin", value: "Made in Vietnam" },
          { name: "Fit", value: "Standard fit" },
        ],
        categories: ["Clothing", "T-Shirts"],
        subcategory: ["Men's Clothing"],
        brand: "Premium Wear",
        quantity: 1,
      },
      {
        id: "4",
        name: "Stylish Denim Jacket",
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        description:
          "This stylish denim jacket is a wardrobe essential. Made from high-quality cotton denim, it offers both comfort and durability. The timeless design features a classic button-up front and pockets for a functional yet fashionable look.",
        features: ["High-quality cotton denim", "Button-up front", "Functional pockets", "Timeless design", "Machine washable"],
        images: [
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
        ],
        colors: [
          { name: "Blue", value: "#0000FF", inStock: true },
          { name: "Black", value: "#000000", inStock: true },
          { name: "Light Blue", value: "#ADD8E6", inStock: true },
          { name: "Gray", value: "#808080", inStock: false },
        ],
        sizes: [
          { name: "S", inStock: true },
          { name: "M", inStock: true },
          { name: "L", inStock: true },
          { name: "XL", inStock: false },
        ],
        stock: 20,
        sku: "DJ-SD-004",
        reviews: [
          {
            id: "1",
            user: "Morgan Davis",
            rating: 5,
            date: "March 20, 2024",
            comment:
              "I absolutely love this jacket! It's perfect for layering and goes with everything. A must-have for any wardrobe.",
          },
        ],
        specifications: [
          { name: "Material", value: "Cotton Denim" },
          { name: "Weight", value: "350g" },
          { name: "Care", value: "Machine wash cold, tumble dry low" },
          { name: "Origin", value: "Made in Italy" },
          { name: "Fit", value: "Regular fit" },
        ],
        categories: ["Clothing", "T-Shirts"],
        subcategory: ["Men's Clothing"],
        brand: "Premium Wear",
        quantity: 1,
      },
      {
        id: "5",
        name: "Luxury Leather Wallet",
        price: 89.99,
        originalPrice: 119.99,
        discount: 25,
        description:
          "Crafted from premium leather, this luxury wallet combines style and function. It features multiple card slots, a cash compartment, and a coin pocket, making it perfect for everyday use or special occasions.",
        features: ["Premium leather", "Multiple card slots", "Coin pocket", "Cash compartment", "Sleek and stylish design"],
        images: [
          "/Image/User/wallet.png?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
          "/Image/User/pi2.jpg?height=600&width=600",
        ],
        colors: [
          { name: "Brown", value: "#8B4513", inStock: true },
          { name: "Black", value: "#000000", inStock: true },
          { name: "Gray", value: "#808080", inStock: true },
          { name: "Blue", value: "#0000FF", inStock: false },
        ],
        sizes: [
          { name: "One Size", inStock: true },
        ],
        stock: 50,
        sku: "WL-LY-005",
        reviews: [
          {
            id: "1",
            user: "Emily Williams",
            rating: 5,
            date: "March 10, 2024",
            comment:
              "This wallet is the perfect combination of style and functionality. The leather is soft and feels high quality.",
          },
        ],
        specifications: [
          { name: "Material", value: "Genuine Leather" },
          { name: "Weight", value: "150g" },
          { name: "Care", value: "Wipe with a damp cloth" },
          { name: "Origin", value: "Made in Spain" },
          { name: "Dimensions", value: "9 x 12 cm" },
        ],
        categories: ["Clothing", "T-Shirts"],
        subcategory: ["Men's Clothing"],
        brand: "Premium Wear",
        quantity: 1,
      },

   
];
export default productData;


