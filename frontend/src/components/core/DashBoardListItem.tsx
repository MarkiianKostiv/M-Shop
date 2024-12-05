import { Trash2 } from "lucide-react";
import { useColumnsStore } from "../../stores/useColumnsStore";
import { Link } from "react-router-dom";
import { DashBoard } from "../../interfaces/column.interface";

export const DashBoardListItem = (dashBoard: DashBoard) => {
  const { deleteDashboard } = useColumnsStore();
  return (
    <li className='relative mt-6'>
      <div className='w-full absolute bottom-[100%] text-right text-red-400 hover:text-red-300 active:text-red-200'>
        <button onClick={() => deleteDashboard(dashBoard._id)}>
          <Trash2 size={18} />
        </button>
      </div>
      <Link
        className='bg-gray-600 flex items-center flex-col gap-2 rounded-lg justify-center p-4 text-center'
        to={`/admin-tasks/${dashBoard._id}`}
      >
        <div className='w-20 h-16 bg-gray-800 rounded-xl'></div>
        <h3>{dashBoard.title}</h3>
      </Link>
    </li>
  );
};
