import { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { CheckCircle2, Loader2, UploadCloud, File, X, ChevronRight, ChevronLeft } from "lucide-react";
import type { Event } from "@/data/events";

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const;
const BRANCH_OPTIONS = [
  "CSE", "IT", "ECE", "EEE", "ME", "CE", "AI-ML", "DS", "IOT", "CS","Others",
] as const;

const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  rollNumber: z.string().min(1, "Roll number required"),
  year: z.string().min(1, "Select year"),
  branch: z.string().min(1, "Select branch"),
  phone: z.string().regex(/^[0-9]{10}$/, "10-digit phone number required"),
});

const optionalMemberSchema = z.object({
  name: z.string().optional().or(z.literal("")),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  rollNumber: z.string().optional().or(z.literal("")),
  year: z.string().optional().or(z.literal("")),
  branch: z.string().optional().or(z.literal("")),
  phone: z.string().regex(/^[0-9]{10}$/, "10-digit phone number required").optional().or(z.literal("")),
}).superRefine((data, ctx) => {
    const fields = Object.values(data);
    const someFilled = fields.some(v => v !== "" && v !== undefined);
    const allFilled = fields.every(v => v !== "" && v !== undefined);
    
    if (someFilled && !allFilled) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please complete all fields for this team member or leave them all empty",
            path: ["name"]
        });
    }
});

const schema = z.object({
  teamName: z.string().min(2, "Team Name must be at least 2 characters"),
  members: z.tuple([
    memberSchema,
    optionalMemberSchema,
    optionalMemberSchema,
    optionalMemberSchema,
  ]),
}).superRefine((data, ctx) => {
  const emails = new Set<string>();
  const phones = new Set<string>();

  data.members.forEach((m, i) => {
    const member = m as Partial<z.infer<typeof memberSchema>>;
    if (member.email && member.phone) {
      const email = member.email.toLowerCase().trim();
      const phone = member.phone.trim();

      if (emails.has(email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate email found within team",
          path: ["members", i, "email"]
        });
      }
      if (phones.has(phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate phone number found within team",
          path: ["members", i, "phone"]
        });
      }
      emails.add(email);
      phones.add(phone);
    }
  });
});

type FormValues = z.infer<typeof schema>;

interface Props {
  event: Event;
  onSuccess?: (registration: any) => void;
}

export default function TeamRegistrationForm({ event, onSuccess }: Props) {
  const [step, setStep] = useState<"team" | "members" | "upload" | "success">("team");
  const [activeMember, setActiveMember] = useState(0);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      teamName: "",
      members: [
        { name: "", email: "", rollNumber: "", year: "", branch: "", phone: "" },
        { name: "", email: "", rollNumber: "", year: "", branch: "", phone: "" },
        { name: "", email: "", rollNumber: "", year: "", branch: "", phone: "" },
        { name: "", email: "", rollNumber: "", year: "", branch: "", phone: "" },
      ]
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "members"
  });

  const handleBack = () => {
    setError("");
    if (step === "members") {
      if (activeMember > 0) {
        setActiveMember((m) => m - 1);
      } else {
        setStep("team");
      }
    } else if (step === "upload") {
      setStep("members");
    }
  };

  const handleNext = async () => {
    setError("");
    let isValid = false;

    if (step === "team") {
      isValid = await trigger("teamName");
      if (isValid) setStep("members");
    } else if (step === "members") {
      const isLeader = activeMember === 0;
      isValid = await trigger(`members.${activeMember}` as any);
      
      if (isValid || (!isLeader)) {
          if (activeMember < 3) {
              setActiveMember(p => p + 1);
          } else {
              setStep("upload");
          }
      }
    }
  };

  const uploadFile = async (): Promise<string> => {
    if (!pptFile) throw new Error("PPT / PPTX file is required.");
    
    setUploadProgress(10);
    const formData = new FormData();
    formData.append("file", pptFile);

    const progressInterval = setInterval(() => {
      setUploadProgress(p => (p < 85 ? p + 5 : p));
    }, 500);

    try {
      const data = await api.registerPPT(formData);
      clearInterval(progressInterval);
      setUploadProgress(100);
      return data.url;
    } catch (err: any) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      throw err;
    }
  };

  const onSubmit = async (values: FormValues) => {
    setError("");
    if (!pptFile) {
        setError("Please upload your PPT presentation.");
        return;
    }
    
    try {
      const pptLink = await uploadFile();
      const result = await api.registerTeam({
        eventId: event.id,
        eventName: event.name,
        eventDate: event.date,
        eventVenue: event.venue,
        teamName: values.teamName,
        members: values.members.filter(m => m.email && m.name) as any,
        pptLink
      });

      setRegistration(result);
      setStep("success");
      onSuccess?.(result);
    } catch (err: any) {
      setError(err.message ?? "Registration failed. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
          "application/vnd.ms-powerpoint", 
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ];
      if (validTypes.includes(file.type) || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
        setPptFile(file);
        setError("");
      } else {
        setError("Only .ppt and .pptx files are allowed.");
        setPptFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  if (step === "success") {
    return (
      <div className="text-center py-4 bg-background/50 rounded-2xl border border-border p-8 backdrop-blur-sm animate-in fade-in duration-500">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
        <h3 className="font-display text-2xl font-bold mb-2">
          Registration Successful!
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Team tickets have been emailed to all members of <strong>{registration?.teamName}</strong>.
        </p>

        {registration?.qrDataUrl && (
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white rounded-xl shadow-lg">
                <img
                src={registration.qrDataUrl}
                alt="QR Ticket"
                className="w-48 h-48 rounded-md"
                />
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mb-6">
          Present this single QR code for your entire team's entry.
        </p>

        <div className="flex justify-center">
          <Button
            className="w-full sm:w-auto min-w-[150px]"
            onClick={() => window.location.href = "/"}
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-background/50 rounded-2xl border border-border p-4 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h2 className="font-display text-xl sm:text-2xl font-bold mb-1">Register for {event.name}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">Build your team (up to 4 members) and submit your idea.</p>
      </div>

      <div className="flex items-center justify-between mb-8 px-1 sm:px-2 relative">
        <div className="absolute top-1/2 left-[12%] right-[12%] sm:left-[16.6%] sm:right-[16.6%] h-[1px] bg-muted -translate-y-1/2 -z-10" />
        {["Team", "Members", "Upload"].map((label, i) => {
          const stepNames = ["team", "members", "upload"];
          const currentIdx = stepNames.indexOf(step);
          const isActive = currentIdx === i;
          const isPast = currentIdx > i;
          
          return (
            <div key={label} className="flex flex-col items-center flex-1">
            <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all relative z-10 ${
                isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110" : 
                isPast ? "bg-primary text-primary-foreground shadow-inner" : 
                "bg-muted text-muted-foreground border-2 border-background"
              }`}>
                {isPast ? <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" /> : i + 1}
              </div>
              <span className={`text-[8px] sm:text-[10px] mt-1.5 font-bold uppercase tracking-wider ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === "team" && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-base">Team Name</Label>
              <Input
                id="teamName"
                placeholder="e.g. Code Ninjas"
                className="h-12 text-lg"
                {...register("teamName")}
              />
              {errors.teamName && (
                <p className="text-xs text-destructive">{errors.teamName.message}</p>
              )}
            </div>
          </div>
        )}

        {step === "members" && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide justify-start sm:justify-center px-1">
              {fields.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveMember(index)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                    activeMember === index 
                    ? "bg-primary/10 text-primary border-primary" 
                    : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                  }`}
                >
                  Member {index + 1} {index === 0 ? "★" : ""}
                </button>
              ))}
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className={`space-y-4 ${activeMember === index ? "block" : "hidden"}`}>
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input placeholder="Name" {...register(`members.${index}.name` as const)} />
                  {errors.members?.[index]?.name && (
                    <p className="text-xs text-destructive">{errors.members[index]?.name?.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" placeholder="Email" {...register(`members.${index}.email` as const)} />
                  {errors.members?.[index]?.email && (
                    <p className="text-xs text-destructive">{errors.members[index]?.email?.message}</p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <Input type="tel" placeholder="10-digit number" {...register(`members.${index}.phone` as const)} />
                  {errors.members?.[index]?.phone && (
                    <p className="text-xs text-destructive">{errors.members[index]?.phone?.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Roll Number</Label>
                  <Input placeholder="e.g. 2024CSE001" {...register(`members.${index}.rollNumber` as const)} />
                  {errors.members?.[index]?.rollNumber && (
                    <p className="text-xs text-destructive">{errors.members[index]?.rollNumber?.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Year</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      {...register(`members.${index}.year` as const)}
                    >
                      <option value="" disabled>Select</option>
                      {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    {errors.members?.[index]?.year && (
                      <p className="text-xs text-destructive">{errors.members[index]?.year?.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Branch</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      {...register(`members.${index}.branch` as const)}
                    >
                      <option value="" disabled>Select</option>
                      {BRANCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    {errors.members?.[index]?.branch && (
                      <p className="text-xs text-destructive">{errors.members[index]?.branch?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === "upload" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-muted/30 border-2 border-dashed border-border rounded-xl p-8 text-center transition-colors hover:bg-muted/50 relative">
              <input 
                type="file" 
                accept=".ppt,.pptx" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              
              {!pptFile ? (
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Upload Presentation</h4>
                  <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-2">Only .ppt or .pptx files allowed</p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-background border border-border p-4 rounded-lg z-20 relative shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden text-left">
                    <div className="bg-orange-500/20 p-2 rounded text-orange-500 shrink-0">
                      <File className="h-6 w-6" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{pptFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(pptFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setPptFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4 text-[11px] sm:text-sm text-blue-700 dark:text-blue-400">
            <p className="font-medium mb-1">Important:</p>
            <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1">
              <li>Ensure your team name is mentioned on the first slide.</li>
              <li>Maximum file size 50MB.</li>
              <li>You cannot edit the file after submission.</li>
            </ul>
          </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 mt-4">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-8 pt-6 border-t border-border/50">
          {step !== "team" && (
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-10 sm:h-11 text-xs sm:text-sm"
              onClick={handleBack}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Back
            </Button>
          )}
          
          {step !== "upload" ? (
            <Button 
              type="button" 
              className={`font-semibold h-10 sm:h-11 text-xs sm:text-sm ${step === "team" ? "w-full" : "flex-1"}`}
              onClick={handleNext}
            >
              Next
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting || !pptFile}
              className="flex-1 h-11 font-bold shadow-lg shadow-primary/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploadProgress > 0 && uploadProgress < 100 
                    ? `Uploading ${Math.round(uploadProgress)}%` 
                    : "Registering…"}
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
