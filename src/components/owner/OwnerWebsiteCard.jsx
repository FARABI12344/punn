
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Label } from '@/components/ui/label'; // Import Label
import { BellRing, Ban, CheckCircle, AlertTriangle } from 'lucide-react';

const OwnerWebsiteCard = ({ website, onToggleSuspend, onSendNotification }) => {
     const [suspensionReason, setSuspensionReason] = useState('');
     const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);

     const handleSuspendConfirm = () => {
        onToggleSuspend(website.pageName, suspensionReason);
        setIsSuspendDialogOpen(false); // Close dialog
        setSuspensionReason(''); // Reset reason
    };

     const handleOpenChangeSuspendDialog = (open) => {
         setIsSuspendDialogOpen(open);
         if (!open) {
             setSuspensionReason(''); // Reset reason if dialog is closed without confirming
         }
     }

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Card className={`bg-white ${website.suspended ? 'border-red-400 border-2 opacity-80' : 'border-purple-200'} transition-all hover:shadow-cartoon-pink`}>
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-grow overflow-hidden">
                        <p className="text-lg font-semibold text-purple-800 break-words">{website.title}</p>
                        <p className="text-sm text-pink-600 break-words">/{website.pageName}</p>
                        <p className="text-xs text-gray-500 mt-1">Owner: {website.owner}</p>
                        {website.suspended && (
                            <div className="mt-1 text-xs font-bold text-red-600 flex items-center gap-1">
                              <AlertTriangle size={14}/> SUSPENDED
                              {website.suspensionDetails?.reason && (
                                  <span className="text-gray-500 font-normal ml-1">(Reason: {website.suspensionDetails.reason})</span>
                              )}
                            </div>
                          )}
                    </div>
                    <div className="flex flex-shrink-0 gap-2 flex-wrap justify-end">
                        <Button variant="outline" size="sm" className="text-purple-700 border-purple-300 hover:bg-purple-50 focus-visible:ring-primary" onClick={() => onSendNotification(website.owner)}>
                            <BellRing size={16} className="mr-1" /> Notify Owner
                        </Button>

                        {/* Suspend / Unsuspend Logic */}
                        {website.suspended ? (
                             // Unsuspend Action (Simple Confirmation)
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <Button variant="secondary" size="sm" className={'bg-green-100 border-green-300 text-green-700 hover:bg-green-200 focus-visible:ring-green-500'}>
                                         <CheckCircle size={16} className="mr-1"/> Unsuspend
                                     </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm Unsuspend</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to unsuspend the page "/{website.pageName}"?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        {/* Pass null for reason when unsuspending */}
                                        <AlertDialogAction onClick={() => onToggleSuspend(website.pageName, null)} className={buttonVariants({ variant: "default" })}>
                                            Yes, Unsuspend
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                             </AlertDialog>
                        ) : (
                            // Suspend Action (With Reason Dialog)
                            <AlertDialog open={isSuspendDialogOpen} onOpenChange={handleOpenChangeSuspendDialog}>
                                <AlertDialogTrigger asChild>
                                    <Button variant={"destructive"} size="sm" className={'bg-red-100 border-red-300 text-red-700 hover:bg-red-200 focus-visible:ring-red-500'}>
                                        <Ban size={16} className="mr-1"/> Suspend
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Suspend Page: /{website.pageName}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Please provide a reason for suspending this page. This will be shown to the user.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="my-4">
                                        <Label htmlFor="suspensionReason" className="mb-2 block">Reason (optional)</Label>
                                        <Textarea
                                            id="suspensionReason"
                                            value={suspensionReason}
                                            onChange={(e) => setSuspensionReason(e.target.value)}
                                            placeholder="e.g., Violation of terms..."
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleSuspendConfirm} className={buttonVariants({ variant: "destructive" })}>
                                            Confirm Suspension
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default OwnerWebsiteCard;
  