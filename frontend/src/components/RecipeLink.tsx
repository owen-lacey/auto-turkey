import './RecipeLink.css';

interface RecipeLinkProps {
  url: string;
}

export function RecipeLink({ url }: RecipeLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="recipe-link-btn"
      onClick={(e) => e.stopPropagation()}
      title="View recipe"
    >
      📖
    </a>
  );
}

