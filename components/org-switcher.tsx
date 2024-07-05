"use client";

import { useState } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import { ChevronDown, Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { useOrganization } from "@/hooks/use-organization";

import { Id } from "@/convex/_generated/dataModel";

interface OrgItemProps {
  id: Id<"organizations">;
  name: string;
  imageUrl: string;
}

interface OrgSwitcherProps {
  className?: string;
}

const OrgItem = ({ id, name, imageUrl }: OrgItemProps) => {
  const { organization, setCurrentOrganization } = useOrganization();

  const onClick = () => {
    if (!setCurrentOrganization) return;
    setCurrentOrganization({ _id: id, name, role: "member" });
  };

  return (
    <CommandItem
      onSelect={onClick}
      className="flex items-center p-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent"
    >
      <Image
        src={imageUrl}
        alt={name}
        width={20}
        height={20}
        className="mr-2 rounded-sm grayscale"
      />
      <span className="text-sm truncate flex-1">{name}</span>
      {organization?._id === id && (
        <Check className="ml-auto h-3 w-3 opacity-50 flex-shrink-0" />
      )}
    </CommandItem>
  );
};

export const OrgSwitcher = ({ className }: OrgSwitcherProps) => {
  const [open, setOpen] = useState(false);
  const { organization, userMemberships } = useOrganization();

  if (!organization) {
    return (
      <div
        className={cn(
          "mx-auto w-[230px] mt-5 p-2.5 flex justify-between items-center border rounded-md",
          className
        )}
      >
        <Skeleton className="h-5 w-[150px]" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    );
  }

  const selectedOrg = organization?.name;
  const selectedOrgImage = organization?.imageUrl;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select an organization"
          className={cn(
            "mx-auto w-[230px] mt-5 p-3 justify-between shadow-sm font-normal text-muted-foreground hover:bg-transparent",
            className
          )}
        >
          <div className="flex items-center">
            {selectedOrgImage && (
              <Image
                src={selectedOrgImage}
                alt={selectedOrg || "Organization"}
                width={20}
                height={20}
                className="mr-2 rounded-sm grayscale flex-shrink-0"
              />
            )}
            <span className="truncate flex-1">{selectedOrg}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[230px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              {userMemberships.data?.map((org) => (
                <OrgItem
                  key={org._id}
                  id={org._id!}
                  name={org.name ?? ""}
                  imageUrl={org.imageUrl ?? ""}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
