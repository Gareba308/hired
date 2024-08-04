import { trpc } from "@/app/_trpc/client";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CertificationLicense } from "@prisma/client";
import ReactQuill from "react-quill";
import { useRef } from "react";
import { Editor } from "@/components/Editor";

type FormSchemaType = z.infer<typeof formSchema>;
const maxCharacters = 250;
const nilCharacters = 0;
export const formSchema = z.object({
  certificateLicenseName: z.string().optional(),
  validForever: z.boolean().default(false).optional(),
  validStartMonth: z.string().optional(),
  validStartYear: z.string().optional(),
  validEndMonth: z.string().optional(),
  validEndYear: z.string().optional(),
  description: z.string(),
});

interface CertificationOnlyCreatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  certificate: CertificationLicense;
  certificateID: string;
}
const EditCertificationModal = ({
  isOpen,
  onClose,
  onConfirm,
  certificate,
  certificateID,
}: CertificationOnlyCreatingModalProps) => {
  const { toast } = useToast();
  const editorRef = useRef<ReactQuill | null>(null);
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificateLicenseName: certificate.certificateLicenseName
        ? certificate.certificateLicenseName
        : "",
      validForever: certificate.validForever ? certificate.validForever : false,
      validStartMonth: certificate.validStartMonth
        ? certificate.validStartMonth
        : "",
      validStartYear: certificate.validStartYear
        ? certificate.validStartYear
        : "",
      validEndMonth: certificate.validEndMonth ? certificate.validEndMonth : "",
      validEndYear: certificate.validEndYear ? certificate.validEndYear : "",
      description: certificate.description ? certificate.description : "",
    },
  });
  const { control } = form;
  const text = useWatch({ control, name: "description" }) || "";
  const cleanText = text.replace(/<[^>]*>/g, "");

  const remainingCharacters = maxCharacters - cleanText.length;
  const excessCharacters = nilCharacters - remainingCharacters;
  const { isSubmitting } = form.formState;

  const { mutate: updateCertification, isLoading } =
    trpc.workerUpdateCertification.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully updated certification detail",
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
              "There was a problem updating your certification details. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = async (values: FormSchemaType) => {
    updateCertification({ ...values, certificationID: certificateID });
  };
  return (
    <Modal
      title="Update Certification or Licenses"
      description="Update details about your certification or licenses"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="text-base">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="certificateLicenseName"
              render={({ field }) => (
                <FormItem className="text-gray-700 text-base">
                  <FormLabel>Certification / License&apos;s Name:</FormLabel>
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

            <FormField
              control={form.control}
              name="validForever"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2.5 text-base">
                  <FormLabel>Validity Period:</FormLabel>
                  <div className="flex flex-row items-start space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        disabled={isLoading || isSubmitting}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label className="font-normal">
                      The certificate or license does not expire
                    </Label>
                  </div>
                  <FormDescription></FormDescription>
                  <FormMessage className="text-red-500 font-normal text-base" />
                </FormItem>
              )}
            />

            <div className="mt-2.5 text-base">
              <Label>Issued:</Label>
              <div className="flex items-center justify-start gap-6 sm:gap-8 w-full mt-1">
                <div>
                  <FormField
                    control={form.control}
                    name="validStartMonth"
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
                                  certificate.validStartMonth
                                    ? certificate.validStartMonth
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
                    name="validStartYear"
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
                                  certificate.validStartYear
                                    ? certificate.validStartYear
                                    : "Year"
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

            <div className="mt-2.5 text-base">
              <Label>Expiry:</Label>
              <div className="flex items-center justify-start gap-6 sm:gap-8 w-full mt-1">
                <div>
                  <FormField
                    control={form.control}
                    name="validEndMonth"
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
                                  certificate.validEndMonth
                                    ? certificate.validEndMonth
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
                        <FormMessage className="text-red-500 font-normal text-base" />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="validEndYear"
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
                                  certificate.validEndYear
                                    ? certificate.validEndYear
                                    : "Year"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full max-h-[400px] overflow-y-scroll">
                            {Array.from({ length: 50 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={`${new Date().getFullYear() - 2 + i}`}
                              >
                                {new Date().getFullYear() - 2 + i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                  <FormMessage className="text-red-500 font-normal text-sm" />
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
                size="lg"
                type="button"
                variant="secondary"
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

export default EditCertificationModal;
