import { Navbar } from "../components/layout/Navbar";
import { Wrapper } from "../components/layout/Wrapper";
import { CanvasModel } from "../canvas";
import editorState from "../stores/editorStore";
import { useSnapshot } from "valtio";
import { AiPicker } from "../components/core/editor/AiPicker";
import { ColorPicker } from "../components/core/editor/ColorPicker";
import { FilePicker } from "../components/core/editor/FilePicker";
import { Tab } from "../components/core/editor/Tab";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { EditorTabs, FilterTabs } from "../constants/ThreeDEditor.constans";
export const ThreeDEditorPage = () => {
  const snap = useSnapshot(editorState);

  return (
    <Wrapper>
      <Navbar />
      <div className='h-[85vh] w-full flex-col flex items-center justify-center'>
        <div className='w-full text-left z-20'>
          <Link to={"/"}>Go Home</Link>
        </div>
        <CanvasModel />
        <motion.div
          key={"custom"}
          className='absolute top-0 left-0 z-10'
        >
          <div className='flex items-center min-h-screen'>
            <div className=''>
              {EditorTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  tab={tab}
                  handleClick={() => {}}
                />
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div className='flex w-full items-center justify-end'></motion.div>
        <motion.div className='flex items-center justify-center gap-3'>
          {FilterTabs.map((tab) => (
            <Tab
              key={tab.name}
              isEditorTab
              isActiveTab=''
              tab={tab}
              handleClick={() => {}}
            />
          ))}
        </motion.div>
      </div>
    </Wrapper>
  );
};
