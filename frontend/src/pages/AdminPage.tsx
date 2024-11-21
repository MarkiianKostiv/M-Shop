import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { Wrapper } from "../components/layout/Wrapper";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreateProductForm } from "../components/core/CreateProductForm";
import { ProductsList } from "../components/core/ProductsList";
import { AnalyticsTab } from "../components/core/AnalyticsTab";
import { useProductStore } from "../stores/useProductStore";

type TabId = "create" | "products" | "analytics";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> &
      React.RefAttributes<SVGSVGElement>
  >;
}

const tabs: Tab[] = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("create");

  const { getAllProducts } = useProductStore();
  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  return (
    <Wrapper>
      <div className='relative z-10 container mx-auto px-4 pb-8'>
        <motion.h1
          className='text-4xl font-bold mb-8 text-emerald-400 text-center'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard
        </motion.h1>

        <div className='flex justify-center mb-8'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className='mr-2 h-5 w-5' />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <ProductsList />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </Wrapper>
  );
};
