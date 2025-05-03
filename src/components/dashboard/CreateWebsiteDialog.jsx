
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { isValidPageName } from '@/lib/utils';
import { PlusCircle, Upload, FileText, Image as ImageIcon, X } from 'lucide-react';

const CreateWebsiteDialog = ({ addWebsite, websiteCount, maxWebsites }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pageName, setPageName] = useState('');
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const { toast } = useToast();

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const resetForm = () => {
        setPageName('');
        setTitle('');
        setShortDescription('');
        setLongDescription('');
        setFiles([]);
        setImages([]);
         // Reset file input values if refs are attached
        if (fileInputRef.current) fileInputRef.current.value = null;
        if (imageInputRef.current) imageInputRef.current.value = null;
    };

    const handleOpenChange = (open) => {
        setIsOpen(open);
        if (!open) {
            resetForm();
        }
    };

    const handleFileChange = (event, type) => {
        const selectedFiles = Array.from(event.target.files);
        if (type === 'file') {
            setFiles(prev => [...prev, ...selectedFiles]);
        } else {
            setImages(prev => [...prev, ...selectedFiles]);
        }
         // Optionally reset the input value to allow selecting the same file again
         event.target.value = null;
    };

     const removeFile = (index, type) => {
        if (type === 'file') {
            setFiles(prev => prev.filter((_, i) => i !== index));
        } else {
            setImages(prev => prev.filter((_, i) => i !== index));
        }
     };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!pageName || !title || !shortDescription || !longDescription) {
            toast({ title: "Error", description: "Page Name, Title, and Descriptions are required.", variant: "destructive" });
            return;
        }
        if (!isValidPageName(pageName)) {
            toast({ title: "Invalid Page Name", description: "Use letters, numbers, hyphens, underscores only.", variant: "destructive" });
            return;
        }

        // Pass the File objects directly; the hook will extract names
        const success = addWebsite(pageName, title, shortDescription, longDescription, files, images);
        if (success) {
            handleOpenChange(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    className="w-full md:w-auto mb-8 flex items-center gap-2 animate-pulse-subtle"
                    disabled={websiteCount >= maxWebsites}
                >
                    <PlusCircle /> {websiteCount >= maxWebsites ? `Website Limit Reached (${maxWebsites})` : 'CREATE NEW WEBSITE'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl bg-white rounded-4xl border-purple-300 border-2 shadow-cartoon-hard"> {/* Wider dialog */}
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-cartoon text-purple-800">Create Your Page</DialogTitle>
                    <DialogDescription className="text-center text-purple-600">
                        Fill in the details for your new page.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-6"> {/* Scrollable content */}
                    {/* Page Name */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pageName" className="text-right">Page Name</Label>
                        <Input id="pageName" value={pageName} onChange={(e) => setPageName(e.target.value.toLowerCase())} placeholder="my-cool-page" className="col-span-3" required />
                    </div>
                    <p className="text-xs text-muted-foreground text-center col-span-4 px-4 -mt-4">URL: {window.location.origin}/{pageName || '{pageName}'}</p>

                    {/* Title */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Page Title" className="col-span-3 text-lg" required />
                    </div>

                    {/* Short Description */}
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="shortDescription" className="text-right">Short Desc.</Label>
                        <Input id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="A brief summary (shows on card)" className="col-span-3" maxLength={100} required />
                    </div>

                    {/* Long Description */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="longDescription" className="text-right pt-3">Long Desc.</Label>
                        <Textarea id="longDescription" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} placeholder="Write the main content for your page here..." className="col-span-3" required />
                    </div>

                    {/* File Upload Section */}
                    <div className="grid grid-cols-4 items-start gap-4">
                         <Label className="text-right pt-3">Attachments</Label>
                         <div className="col-span-3 space-y-4">
                            {/* File Upload */}
                             <div>
                                 <input
                                     type="file"
                                     ref={fileInputRef}
                                     onChange={(e) => handleFileChange(e, 'file')}
                                     multiple
                                     className="hidden"
                                     id="file-upload"
                                 />
                                 <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                     <Upload className="mr-2 h-4 w-4" /> Upload Files
                                 </Button>
                                  <p className="text-xs text-muted-foreground mt-1">Select documents, PDFs, etc.</p>
                                 <div className="mt-2 space-y-1">
                                      {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between text-sm bg-gray-100 px-2 py-1 rounded">
                                            <span className="flex items-center gap-1 truncate"> <FileText size={14} className="flex-shrink-0"/> {file.name}</span>
                                            <Button type="button" variant="ghost" size="icon" className="h-5 w-5 text-red-500 hover:bg-red-100" onClick={() => removeFile(index, 'file')}>
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                 </div>
                             </div>
                             {/* Image Upload */}
                            <div>
                                 <input
                                     type="file"
                                     ref={imageInputRef}
                                     onChange={(e) => handleFileChange(e, 'image')}
                                     multiple
                                     accept="image/*"
                                     className="hidden"
                                     id="image-upload"
                                 />
                                 <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}>
                                     <ImageIcon className="mr-2 h-4 w-4" /> Upload Images
                                 </Button>
                                 <p className="text-xs text-muted-foreground mt-1">Select JPG, PNG, GIF, etc.</p>
                                 <div className="mt-2 space-y-1">
                                      {images.map((image, index) => (
                                         <div key={index} className="flex items-center justify-between text-sm bg-gray-100 px-2 py-1 rounded">
                                             <span className="flex items-center gap-1 truncate"><ImageIcon size={14} className="flex-shrink-0"/> {image.name}</span>
                                             <Button type="button" variant="ghost" size="icon" className="h-5 w-5 text-red-500 hover:bg-red-100" onClick={() => removeFile(index, 'image')}>
                                                 <X size={14} />
                                             </Button>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                              <p className="text-xs text-purple-600 italic mt-2">Note: Actual file storage requires Supabase integration (coming soon!). Currently, only file names are saved.</p>
                         </div>
                    </div>


                    <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 -mx-6 px-6 pb-6">
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Create Page</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateWebsiteDialog;
  