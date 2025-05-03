
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, Image as ImageIcon, X } from 'lucide-react';

const EditWebsiteDialog = ({ isOpen, onOpenChange, website, updateWebsite }) => {
    const [editTitle, setEditTitle] = useState('');
    const [editShortDescription, setEditShortDescription] = useState('');
    const [editLongDescription, setEditLongDescription] = useState('');
    const [files, setFiles] = useState([]); // Store File objects or existing file names
    const [images, setImages] = useState([]); // Store File objects or existing file names
    const { toast } = useToast();

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    useEffect(() => {
        if (website) {
            setEditTitle(website.title || '');
            setEditShortDescription(website.shortDescription || '');
            setEditLongDescription(website.description || '');
             // Initialize with existing file names (as objects with a 'name' property)
             setFiles(website.files || []);
             setImages(website.images || []);
        } else {
            setEditTitle('');
            setEditShortDescription('');
            setEditLongDescription('');
            setFiles([]);
            setImages([]);
        }
         // Reset file input values if refs are attached
        if (fileInputRef.current) fileInputRef.current.value = null;
        if (imageInputRef.current) imageInputRef.current.value = null;
    }, [website]);

     const handleFileChange = (event, type) => {
        const selectedFiles = Array.from(event.target.files);
        if (type === 'file') {
            // Append new File objects
             setFiles(prev => [...prev, ...selectedFiles]);
        } else {
             setImages(prev => [...prev, ...selectedFiles]);
        }
         event.target.value = null; // Allow re-selecting same file
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
        if (!website || !editTitle || !editShortDescription || !editLongDescription) {
            toast({ title: "Error", description: "Title and descriptions are required.", variant: "destructive" });
            return;
        }
         // Pass the current list of files/images (mix of old names and new File objects)
        const success = updateWebsite(website.pageName, editTitle, editShortDescription, editLongDescription, files, images);
        if (success) {
            onOpenChange(false);
        }
    };

     const handleOpenChange = (open) => {
        onOpenChange(open);
        if (!open) {
             // Reset state explicitly when dialog is closed via cancel/X button
             setEditTitle('');
             setEditShortDescription('');
             setEditLongDescription('');
             setFiles([]);
             setImages([]);
             if (fileInputRef.current) fileInputRef.current.value = null;
             if (imageInputRef.current) imageInputRef.current.value = null;
        }
    };


    if (!isOpen || !website) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-3xl bg-white rounded-4xl border-purple-300 border-2 shadow-cartoon-hard"> {/* Wider dialog */}
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-cartoon text-purple-800">Edit Page: /{website.pageName}</DialogTitle>
                    <DialogDescription className="text-center text-purple-600">
                        Update the details for your page.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-6"> {/* Scrollable content */}
                     {/* Title */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="editTitle" className="text-right">Title</Label>
                        <Input id="editTitle" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="My Awesome Notes Page" className="col-span-3 text-lg" required />
                    </div>

                    {/* Short Description */}
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="editShortDescription" className="text-right">Short Desc.</Label>
                        <Input id="editShortDescription" value={editShortDescription} onChange={(e) => setEditShortDescription(e.target.value)} placeholder="A brief summary (shows on card)" className="col-span-3" maxLength={100} required />
                    </div>

                    {/* Long Description */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="editLongDescription" className="text-right pt-3">Long Desc.</Label>
                        <Textarea id="editLongDescription" value={editLongDescription} onChange={(e) => setEditLongDescription(e.target.value)} placeholder="Write the main content for your page here..." className="col-span-3" required />
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
                                     id="edit-file-upload"
                                 />
                                 <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                     <Upload className="mr-2 h-4 w-4" /> Upload New Files
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
                                     id="edit-image-upload"
                                 />
                                 <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}>
                                     <ImageIcon className="mr-2 h-4 w-4" /> Upload New Images
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
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditWebsiteDialog;
  