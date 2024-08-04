import { trpc } from "@/app/_trpc/client";
import { Editor } from "@/components/Editor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award } from "@prisma/client";
import ReactQuill from "react-quill";
import { useRef } from "react";

type FormSchemaType = z.infer<typeof formSchema>;
const maxCharacters = 250;
const nilCharacters = 0;
export const formSchema = z.object({
  title: z.string().optional(),
  awardedMonth: z.string().optional(),
  awardedYear: z.string().optional(),
  description: z.string(),
});

interface EditAwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  award: Award;
}
const EditAwardModal = ({
  isOpen,
  onClose,
  onConfirm,
  award,
}: EditAwardModalProps) => {
  const { toast } = useToast();

  const router = useRouter();
  const editorRef = useRef<ReactQuill | null>(null);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: award.title ? award.title : "",
      awardedMonth: award.awardedMonth ? award.awardedMonth : "",
      awardedYear: award.awardedYear ? award.awardedYear : "",
      description: award.description ? award.description : "",
    },
  });

  const { control } = form;
  const text = useWatch({ control, name: "description" }) || "";
  const cleanText = text.replace(/<[^>]*>/g, "");

  const remainingCharacters = maxCharacters - cleanText.length;

  const excessCharacters = nilCharacters - remainingCharacters;

  const { isSubmitting } = form.formState;

  const { mutate: updateAward, isLoading } = trpc.workerUpdateAward.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully updated award detail",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
        onConfirm();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong",
            description: err.message,
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description:
              "There was a problem updating your award details. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    }
  );

  const onSubmit = async (values: FormSchemaType) => {
    updateAward({ ...values, awardID: award.id });
  };
  return (
    <Modal
      title="Update Award Details"
      description="Update details about the professional relevant award you have received"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="text-base">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="text-gray-700 text-base">
                  <FormLabel>Award Title:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Driver's License"
                      type="text"
                      required
                      disabled={isLoading || isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 font-normal text-base" />
                </FormItem>
              )}
            />

            <div className="mt-2.5 text-base">
              <Label>Awarded:</Label>
              <div className="flex items-center justify-start gap-6 sm:gap-8 w-full mt-1">
                <div>
                  <FormField
                    control={form.control}
                    name="awardedMonth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col text-base">
                        <Select
                          onValueChange={field.onChange}
                          disabled={isLoading || isSubmitting}
                        >
                          <FormControl className="w-[120px] sm:w-[130px]">
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  award.awardedMonth
                                    ? award.awardedMonth
                                    : "Month"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full overflow-y-scroll">
                            <SelectItem value="1">January</SelectItem>
                            <SelectItem value="2">February</SelectItem>
                            <SelectItem value="3">March</SelectItem>
                            <SelectItem value="4">April</SelectItem>
                            <SelectItem value="5">May</SelectItem>
                            <SelectItem value="6">June</SelectItem>
                            <SelectItem value="7">July</SelectItem>
                            <SelectItem value="8">August</SelectItem>
                            <SelectItem value="9">September</SelectItem>
                            <SelectItem value="10">October</SelectItem>
                            <SelectItem value="11">November</SelectItem>
                            <SelectItem value="12">December</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription></FormDescription>
                        <FormMessage className="text-red-500 font-normal text-base" />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="awardedYear"
                    render={({ field }) => (
                      <FormItem className="flex flex-col text-base">
                        <Select
                          onValueChange={field.onChange}
                          disabled={isLoading || isSubmitting}
                        >
                          <FormControl className="w-[120px] sm:w-[130px]">
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  award.awardedYear ? award.awardedYear : "Year"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full max-h-[400px] overflow-y-scroll">
                            {Array.from({ length: 60 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={`${new Date().getFullYear() - i}`}
                              >
                                {new Date().getFullYear() - i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription></FormDescription>
                        <FormMessage className="text-red-500 font-normal text-base" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              disabled={isLoading || isSubmitting}
              render={({ field }) => (
                <FormItem className="flex flex-col text-base mt-2.5">
                  <FormLabel>Description</FormLabel>
                  <Label className="text-base font-normal flex">
                    {remainingCharacters >= 0 ? (
                      <p className="-mt-1.5">
                        Max Characters Left:{" "}
                        <b className="text-gray-700">
                          {remainingCharacters}/{maxCharacters}
                        </b>
                      </p>
                    ) : (
                      <div className="-mt-1.5">
                        <p className="text-red-600">
                          You have reached maximum characters
                        </p>
                        <p className="-mt-0.5">
                          Excess Characters:{" "}
                          <b className="text-red-600">{excessCharacters}</b>
                        </p>
                      </div>
                    )}
                  </Label>
                  <FormControl>
                    <Editor
                      {...field}
                      ref={(editor) => (editorRef.current = editor)}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 font-normal text-base" />
                </FormItem>
              )}
            />

            <div className="pt-4 space-x-4 flex items-center justify-start w-full">
              <Button
                disabled={isLoading || isSubmitting || remainingCharacters < 0}
                size="lg"
                type="submit"
                className="rounded-sm"
              >
                {isLoading ? (
                  <span className="items-center flex">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </span>
                ) : (
                  <>Update</>
                )}
              </Button>
              <Button
                disabled={isLoading || isSubmitting}
                onClick={onClose}
                type="button"
                variant="secondary"
                size="lg"
                className="border-gray-300 border bg-slate-200 rounded-sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default EditAwardModal;
