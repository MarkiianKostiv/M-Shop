type TabProps = {
  tab: {
    name: string;
    icon?: string;
  };
  isEditorTab?: boolean;
  isActiveTab?: string;
  handleClick: () => void;
};

export const Tab: React.FC<TabProps> = ({ tab, handleClick }) => {
  const { name, icon } = tab;

  return (
    <div onClick={handleClick}>
      {icon && (
        <img
          src={icon}
          alt={`${name} icon`}
        />
      )}
      <span>{name}</span>
    </div>
  );
};
