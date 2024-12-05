import { useEffect, useState } from "react";
import { Wrapper } from "../components/layout/Wrapper";
import { useColumnsStore } from "../stores/useColumnsStore";
import { Plus } from "lucide-react";
import { DashBoardListItem } from "../components/core/DashBoardListItem";

export const TasksListPage = () => {
  const { dashBoards, getAllDashBoards, createDashboard } = useColumnsStore();
  const [newTitle, setNewTitle] = useState<string>("");
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);

  useEffect(() => {
    getAllDashBoards();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleAddDashboard = () => {
    if (newTitle.trim()) {
      const newDashBoard = { title: newTitle };
      createDashboard(newDashBoard);
      setNewTitle("");
      setIsInputVisible(false);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Wrapper>
      <div className='flex items-center justify-center'>
        <h2 className='text-center text-3xl font-extrabold text-emerald-400'>
          Active DashBoards
        </h2>
      </div>
      <ul className='flex items-center justify-start flex-wrap px-12 py-8 gap-5'>
        <li className='mt-6'>
          <button
            className='bg-gray-600 flex items-center rounded-lg flex-col relative gap-2 justify-center py-[32px] px-4 text-center'
            onClick={() => setIsInputVisible(!isInputVisible)}
          >
            <div className='w-20 h-16 bg-gray-800 flex items-center justify-center rounded-xl'>
              <Plus size={18} />
            </div>
            {isInputVisible && (
              <div className='absolute flex items-center justify-start left-0 top-[100%] w-[400px]'>
                <input
                  type='text'
                  value={newTitle}
                  onChange={handleTitleChange}
                  onClick={handleInputClick}
                  className='p-2 border border-gray-300 rounded text-black'
                  placeholder='Enter dashboard title'
                />
                <button
                  onClick={handleAddDashboard}
                  className='bg-emerald-400 text-white px-4 py-2 rounded'
                >
                  Add Dashboard
                </button>
              </div>
            )}
          </button>
        </li>
        {dashBoards.map((dashBoard) => (
          <DashBoardListItem
            key={dashBoard._id}
            {...dashBoard}
          />
        ))}
      </ul>
    </Wrapper>
  );
};
