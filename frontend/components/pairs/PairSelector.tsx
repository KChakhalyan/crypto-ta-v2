"use client";

import * as React from "react";
import { ChevronsUpDown, Star, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PairSelectorProps {
  pairs: string[];
  onSelect: (pair: string) => void;
}

const initialFavorites = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
];

export function PairSelector({ pairs, onSelect }: PairSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [favorites, setFavorites] = React.useState<string[]>(initialFavorites);
  const [selected, setSelected] = React.useState<string>("BTCUSDT");

  const handleSelect = (pair: string) => {
    setSelected(pair);
    onSelect(pair);
    setOpen(false);
  };

  const toggleFavorite = (pair: string) => {
    setFavorites((prev) =>
      prev.includes(pair) ? prev.filter((p) => p !== pair) : [...prev, pair]
    );
  };

  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold flex items-center gap-2">
        <ListFilter className="h-4 w-4" /> Pairs
      </h3>

      {/* Combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selected || "Select pair..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search pairs..." />
            <CommandEmpty>No pair found.</CommandEmpty>
            <CommandList className="max-h-[250px] overflow-y-auto">
              <CommandGroup heading="All Pairs">
                {pairs.map((pair) => (
                  <CommandItem
                    key={pair}
                    value={pair}
                    onSelect={() => handleSelect(pair)}
                  >
                    {pair}
                    <Star
                      className={cn(
                        "ml-auto h-4 w-4 cursor-pointer",
                        favorites.includes(pair)
                          ? "text-yellow-500 fill-yellow-500"
                          : "opacity-40"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(pair);
                      }}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Favorites */}
      <div className="flex flex-wrap gap-2">
        {favorites.map((pair) => (
          <Badge
            key={pair}
            onClick={() => handleSelect(pair)}
            className={cn(
              "cursor-pointer",
              selected === pair ? "bg-primary text-primary-foreground" : ""
            )}
          >
            <Star className="mr-1 h-3 w-3" />
            {pair}
          </Badge>
        ))}
      </div>
    </section>
  );
}
