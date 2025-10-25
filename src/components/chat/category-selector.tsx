import React from "react";
import { Button } from "@/components/ui/button";

interface CategorySelectorProps {
  categories: string[];
  onCategorySelect: (category: string) => void;
  disabled?: boolean;
}

const categoryIcons: Record<string, string> = {
  family: "👨‍👩‍👧‍👦",
  job: "💼",
  mentality: "🧠"
};

const categoryDescriptions: Record<string, string> = {
  family: "Family & Relationships",
  job: "Career & Work",
  mentality: "Mental Health & Wellbeing"
};

export default function CategorySelector({ categories, onCategorySelect, disabled = false }: CategorySelectorProps) {
  return (
    <div className="mt-3 space-y-2">
      <p className="text-sm text-muted-foreground mb-3">
        Which area would you like me to focus on for advice?
      </p>
      <div className="flex flex-col gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className="justify-start h-auto p-3 text-left"
            onClick={() => onCategorySelect(category)}
            disabled={disabled}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{categoryIcons[category] || "📝"}</span>
              <div>
                <div className="font-medium">{categoryDescriptions[category] || category}</div>
                <div className="text-xs text-muted-foreground">
                  Get specific advice for {category} related concerns
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
