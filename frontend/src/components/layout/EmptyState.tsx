interface IEmptyStateProps {
  containerClassName?: string;
  headerText?: string;
  description?: string;
  actionText?: string;
  action?: () => void;
}
export const EmptyState = ({
  containerClassName,
  headerText = "No data found",
  description,
  actionText,
  action,
}: IEmptyStateProps) => {
  return (
    <div className={containerClassName}>
      <h2>{headerText}</h2>
      {description && <p>{description}</p>}
      {actionText && action && (
        <button
          type='button'
          onClick={action}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
