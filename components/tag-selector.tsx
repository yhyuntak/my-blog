"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  availableTags?: string[];
}

export function TagSelector({
  selectedTags,
  onChange,
  availableTags = [],
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = availableTags.filter(
    (tag) =>
      tag.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      onChange([...selectedTags, trimmedTag]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded-lg border bg-background">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-primary/10 text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-primary/20 rounded-sm p-0.5 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay to allow clicking suggestions
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? "Type tag and press Enter..." : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent placeholder:text-muted-foreground"
        />
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && inputValue && (
        <div className="rounded-lg border bg-popover shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Type and press Enter to add tags. Click X to remove.
      </p>
    </div>
  );
}
