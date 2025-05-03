
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { buttonVariants } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2, ExternalLink, Copy, AlertTriangle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const WebsiteCard = ({ website, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { appealSuspension } = useAuth(); // Use appeal function from context
    const [appealMessage, setAppealMessage] = React.useState('');

    const copyLink = (pageName) => {
      const url = `${window.location.origin}/${pageName}`;
      navigator.clipboard.writeText(url)
          .then(() => {
              toast({ title: "Link Copied!", description: url });
          })
          .catch(err => {
              toast({ title: "Copy Failed", description: "Could not copy link.", variant: "destructive" });
          });
    };

    const handleAppeal = () => {
        if (!appealMessage.trim()) {
            toast({ title: "Error", description: "Please enter a message for your appeal.", variant: "destructive" });
            return;
        }
        appealSuspension(website.pageName, appealMessage);
        setAppealMessage(''); // Clear message after sending
        // Close dialog if needed - requires managing dialog open state here or passing a close function
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        >
            <Card className={`flex flex-col h-full bg-white card-interactive overflow-hidden ${website.suspended ? 'border-red-400 border-2 opacity-80' : 'border-purple-200'}`}>
                 {website.suspended && (
                     <div className="bg-red-100 text-red-700 px-3 py-1 text-xs font-bold flex items-center gap-1">
                        <AlertTriangle size={14} /> SUSPENDED
                     </div>
                 )}
                <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex-grow overflow-hidden">
                            <CardTitle className="text-xl mb-0.5 break-words line-clamp-2">{website.title}</CardTitle>
                            <CardDescription className="text-pink-600 font-semibold text-sm break-all">/{website.pageName}</CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-gray-500 hover:bg-purple-100 focus-visible:ring-primary">
                                    <MoreVertical size={20} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="shadow-cartoon-hard border-purple-300">
                                {!website.suspended && (
                                    <>
                                        <DropdownMenuItem onClick={() => onEdit(website)} className="flex items-center gap-2 cursor-pointer focus:bg-accent">
                                            <Edit size={16} /> Edit Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate(`/${website.pageName}`)} className="flex items-center gap-2 cursor-pointer focus:bg-accent">
                                            <ExternalLink size={16} /> View Page
                                        </DropdownMenuItem>
                                    </>
                                )}
                                {website.suspended && (
                                      <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 cursor-pointer focus:bg-accent text-blue-600 focus:text-blue-700">
                                                <MessageSquare size={16} /> Appeal Suspension
                                            </DropdownMenuItem>
                                          </AlertDialogTrigger>
                                           <AlertDialogContent>
                                              <AlertDialogHeader>
                                                  <AlertDialogTitle>Appeal Suspension for /{website.pageName}</AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                      Send a message to the site owner to request unsuspension. Explain why your page should be reinstated.
                                                  </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <textarea
                                                 value={appealMessage}
                                                 onChange={(e) => setAppealMessage(e.target.value)}
                                                 placeholder="Your message..."
                                                 className="w-full min-h-[100px] rounded-lg border-2 border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-cartoon-inset focus:shadow-cartoon-hard focus:border-primary transition-all duration-150 my-4"
                                               />
                                              <AlertDialogFooter>
                                                  <AlertDialogCancel onClick={() => setAppealMessage('')}>Cancel</AlertDialogCancel>
                                                  {/* AlertDialogAction closes the dialog by default, so we call handleAppeal */}
                                                  <AlertDialogAction onClick={handleAppeal} disabled={!appealMessage.trim()} >Send Appeal</AlertDialogAction>
                                              </AlertDialogFooter>
                                          </AlertDialogContent>
                                      </AlertDialog>
                                )}
                                <DropdownMenuItem onClick={() => copyLink(website.pageName)} className="flex items-center gap-2 cursor-pointer focus:bg-accent">
                                    <Copy size={16} /> Copy Link
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                                            <Trash2 size={16} /> Delete Page
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the page "/{website.pageName}" and all its content.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onDelete(website.pageName)} className={buttonVariants({ variant: "destructive" })}>
                                                Yes, Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow px-4 pb-3 pt-2">
                    {/* Display Short Description */}
                    <p className="text-gray-600 text-sm line-clamp-3">{website.shortDescription || 'No short description provided.'}</p>
                </CardContent>
                <CardFooter className="px-4 pb-3 pt-2 mt-auto">
                    <p className="text-xs text-gray-400">Created: {new Date(website.createdAt).toLocaleDateString()}</p>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default WebsiteCard;
  