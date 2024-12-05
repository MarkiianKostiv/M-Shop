import { Link } from "react-router-dom";
import { CategoryItem } from "../components/core/CategoryItem";
import { Navbar } from "../components/layout/Navbar";
import { Wrapper } from "../components/layout/Wrapper";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "t-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

export const Home = () => {
  return (
    <Wrapper>
      <Navbar />
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
          Explore Our Categories
        </h1>
        <p className='text-center text-xl text-gray-300 mb-12'>
          Discover the latest trends in eco-friendly fashion
        </p>

        <Link to={"/3-d-creator"}>Tyy our new 3d Editor</Link>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories.map((category) => (
            <CategoryItem
              category={category}
              key={category.name}
            />
          ))}
        </div>

        {/* {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />} */}
      </div>
    </Wrapper>
  );
};