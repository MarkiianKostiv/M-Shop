import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../../stores/useProductStore";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IProduct } from "../../interfaces/product.interface";

export const ProductsList = () => {
  const { products, deleteProduct, toggleFeaturedProduct } = useProductStore();

  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => <p>{getValue<string>()}</p>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ getValue }) => <p>{getValue<string>()}</p>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => <p>${getValue<number>()}</p>,
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ getValue }) => (
        <img
          className='w-12 h-12 rounded-full object-cover'
          src={getValue<string>()}
          alt='product-img'
        />
      ),
    },
    {
      header: "Featured",
      cell: ({ row }) => (
        <button
          onClick={() => toggleFeaturedProduct(row.original._id)}
          className={`p-1 rounded-full ${
            row.original.isFeatured
              ? "bg-yellow-400 text-gray-900"
              : "bg-gray-600 text-gray-300"
          } hover:bg-yellow-500 transition-colors duration-200`}
        >
          <Star className='h-5 w-5' />
        </button>
      ),
    },
    {
      header: "Delete",
      cell: ({ row }) => (
        <button
          onClick={() => deleteProduct(row.original._id)}
          className='text-red-400 hover:text-red-300'
        >
          <Trash className='h-5 w-5' />
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <motion.div
      className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {products.length === 0 ? (
        <div className='text-center py-8'>No any products</div>
      ) : (
        <>
          <table className='flex flex-col rounded-xl border border-[#fff]'>
            <thead className='flex justify-around border-b border-[#fff] text-center'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  className='flex'
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      className='flex w-20 h-16 items-center justify-center'
                      key={header.id}
                    >
                      {typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header || null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  className={`flex justify-around ${
                    rowIndex === table.getRowModel().rows.length - 1
                      ? ""
                      : "border-b"
                  } border-[#fff]`}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <td
                      className={`w-20 h-16 py-10 flex items-center justify-center ${
                        cellIndex === 0 ? "" : "border-l border-[#fff]"
                      }`}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className='flex flex-col justify-center items-start py-4 pl-4 text-start'>
            <div className='w-36 ml-3'>
              Page: {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>

            <div className='flex items-center justify-start gap-3 w-36'>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"< Back"}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {" Next >"}
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
