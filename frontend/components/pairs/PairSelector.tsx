"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Star } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface PairSelectorProps {
  pairs: string[];
  onSelect: (pair: string) => void;
}

const initialFavorites = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "SOLUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "DOTUSDT",
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
    <div className="w-full h-full min-h-0 flex flex-col space-y-3 bg-white p-2 rounded-md">
      {/* Текущая выбранная пара */}
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
              <CommandGroup heading="Favorites">
                {favorites.map((pair) => (
                  <CommandItem
                    key={pair}
                    value={pair}
                    onSelect={() => handleSelect(pair)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected === pair ? "opacity-100" : "opacity-0"
                      )}
                    />
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
              <CommandGroup heading="All Pairs">
                {pairs.map((pair) => (
                  <CommandItem
                    key={pair}
                    value={pair}
                    onSelect={() => handleSelect(pair)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected === pair ? "opacity-100" : "opacity-0"
                      )}
                    />
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

      {/* All pairs — занимает остаток высоты и скроллится */}
      <div className="flex-1 min-h-0 flex flex-col">
        <h3 className="text-sm font-semibold mb-2">All Pairs</h3>
        <ScrollArea className="flex-1 min-h-0 rounded-md border p-2">
          <div className="space-y-2">
            {pairs.map((pair) => (
              <React.Fragment key={pair}>
                <div className="text-sm">{pair}</div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
