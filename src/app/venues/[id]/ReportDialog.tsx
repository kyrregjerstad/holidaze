import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
} from '@/components/ui/dialog';
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FlagIcon } from 'lucide-react';

export function ReportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="gap-2 text-gray-500 underline hover:text-inherit dark:text-gray-400"
          variant="link"
        >
          <FlagIcon className="h-4 w-4" />
          Report this listing
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this listing</DialogTitle>
          <DialogDescription>
            This won’t be shared with the Host.
          </DialogDescription>
          <div className="py-6">
            <form>
              <RadioGroup>
                <Label
                  className="flex w-full cursor-pointer items-center text-base font-normal"
                  htmlFor="inaccurate"
                >
                  It’s inaccurate or incorrect
                  <RadioGroupItem
                    className="ml-auto"
                    id="inaccurate"
                    value="inaccurate"
                  />
                </Label>
                <Separator className="my-4" />
                <Label
                  className="flex w-full cursor-pointer items-center text-base font-normal"
                  htmlFor="not_a_place"
                >
                  It’s not a place to stay
                  <RadioGroupItem
                    className="ml-auto"
                    id="not_a_place"
                    value="not_a_place"
                  />
                </Label>
                <Separator className="my-4" />
                <Label
                  className="flex w-full cursor-pointer items-center text-base font-normal"
                  htmlFor="scam"
                >
                  It’s a scam
                  <RadioGroupItem className="ml-auto" id="scam" value="scam" />
                </Label>
                <Separator className="my-4" />
                <Label
                  className="flex w-full cursor-pointer items-center text-base font-normal"
                  htmlFor="offensive"
                >
                  It’s offensive
                  <RadioGroupItem
                    className="ml-auto"
                    id="offensive"
                    value="offensive"
                  />
                </Label>
                <Separator className="my-4" />
                <Label
                  className="flex w-full cursor-pointer items-center text-base font-normal"
                  htmlFor="something_else"
                >
                  It’s something else
                  <RadioGroupItem
                    className="ml-auto"
                    id="something_else"
                    value="something_else"
                  />
                </Label>
              </RadioGroup>
            </form>
          </div>
        </DialogHeader>
        <DialogFooter>
          <div>
            <Button variant="ghost">Cancel</Button>
          </div>
          <Button>Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
