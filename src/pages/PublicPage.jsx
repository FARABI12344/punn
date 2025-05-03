
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AlertTriangle, Timer, Eye, Info, FileText, Image as ImageIcon } from 'lucide-react';
import NotFoundPage from './NotFoundPage';

const PublicPage = () => {
  const { pageName } = useParams();
  const { getWebsite } = useAuth();
  const navigate = useNavigate();

  const [website, setWebsite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdWall, setShowAdWall] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [adClicked, setAdClicked] = useState(false);

  useEffect(() => {
    const fetchedWebsite = getWebsite(pageName);
    setWebsite(fetchedWebsite);
    setIsLoading(false);

    const adWallBypassed = sessionStorage.getItem(`adWallBypassed_${pageName}`);
    if (adWallBypassed === 'true') {
       setShowAdWall(false);
    } else if (fetchedWebsite && fetchedWebsite.suspended) {
        setShowAdWall(false);
    } else if (!fetchedWebsite) {
        setShowAdWall(false);
    } else {
        setShowAdWall(true);
        setAdClicked(false);
        setCountdown(5);
    }

  }, [pageName, getWebsite]);

 useEffect(() => {
    let timer;
    if (adClicked && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (adClicked && countdown === 0) {
      setShowAdWall(false);
      sessionStorage.setItem(`adWallBypassed_${pageName}`, 'true');
    }
    return () => clearTimeout(timer);
  }, [adClicked, countdown, pageName]);

  const handleWatchAd = () => {
    const adWindow = window.open('https://sawutser.top/4/9286425', '_blank', 'noopener,noreferrer');
    if (!adWindow || adWindow.closed || typeof adWindow.closed === 'undefined') {
         alert("Please disable your popup blocker to watch the ad.");
     }
    setAdClicked(true);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  if (!website) {
    return <NotFoundPage />;
  }

   if (website.suspended) {
     const reason = website.suspensionDetails?.reason || "No reason provided";
     const timestamp = website.suspensionDetails?.timestamp
        ? new Date(website.suspensionDetails.timestamp).toLocaleString()
        : null;

     return (
       <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <Header subtitle="Page Access Denied" showLink={true} />
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
             <Card className="max-w-lg bg-red-100 border-red-400 shadow-cartoon-hard animate-bounce-in">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-red-700 text-2xl">
                       <AlertTriangle /> Page Suspended
                    </CardTitle>
                </CardHeader>
                 <CardContent className="space-y-3 text-red-600">
                     <p>This page <span className="font-bold">/{pageName}</span> has been suspended by the site owner.</p>
                     <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-left">
                         <p className="font-semibold flex items-center gap-1"><Info size={16}/> Suspension Reason:</p>
                         <p className="mt-1 italic">{reason}</p>
                         {timestamp && <p className="text-xs text-red-400 mt-1">Suspended on: {timestamp}</p>}
                     </div>
                     <p className="text-sm">If you believe this is an error, please contact the site owner.</p>
                 </CardContent>
                 <CardFooter className="justify-center pt-4">
                    <Link to="/">
                         <Button variant="secondary" className="bg-white border-red-300 text-red-600 hover:bg-red-50">Go to Home</Button>
                     </Link>
                 </CardFooter>
             </Card>
          </motion.div>
       </div>
     );
   }

   const renderAttachments = (items, IconComponent) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="mt-6 border-t border-purple-100 pt-4">
                <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-1">
                  <IconComponent size={16} /> {IconComponent === FileText ? 'Files' : 'Images'} Attached
                </h4>
                <ul className="list-none p-0 space-y-1">
                    {items.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-1">
                            <IconComponent size={14} className="flex-shrink-0" />
                            <span>{item.name}</span>
                            {/* Link placeholder - needs actual URLs from backend */}
                            {/* <a href="#" className="text-blue-500 hover:underline ml-2 text-xs">(download)</a> */}
                        </li>
                    ))}
                </ul>
                 <p className="text-xs text-purple-600 italic mt-2">Actual download requires Supabase integration.</p>
            </div>
        );
    };


  return (
    <div className="flex flex-col items-center min-h-screen p-4 pt-0">
      <Header subtitle={`Viewing Page: /${pageName}`} showLink={true}/>

      <motion.div
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2, duration: 0.5 }}
         className="w-full max-w-3xl mb-8"
       >
         <Card className="bg-white/80 backdrop-blur-sm shadow-cartoon-hard overflow-hidden animate-pop-in">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100 p-6">
                <CardTitle className="text-3xl text-purple-900 text-center break-words">{website.title}</CardTitle>
                 {website.shortDescription && (
                    <CardDescription className="text-center text-purple-700 mt-2 text-base">
                        {website.shortDescription}
                    </CardDescription>
                 )}
            </CardHeader>
            <CardContent className="p-6 md:p-8">
               {showAdWall ? (
                   <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center p-6 bg-yellow-100 border-2 border-yellow-300 rounded-3xl shadow-cartoon-soft animate-float"
                    >
                       <h3 className="text-xl font-semibold text-yellow-800 mb-3 flex items-center justify-center gap-2"> <AlertTriangle className="text-yellow-600"/> Content Locked</h3>
                       <p className="text-yellow-700 mb-4">Please watch a short ad (opens in new tab) to view the content.</p>
                        {!adClicked ? (
                            <Button onClick={handleWatchAd} size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 animate-pulse-subtle">
                                <Eye className="mr-2" size={20}/> Watch Ad to View
                            </Button>
                        ) : (
                            <div className="mt-4 text-center">
                                <p className="text-lg font-semibold text-purple-700 flex items-center justify-center gap-2">
                                   <Timer className="animate-spin" size={24}/> Unlocking in {countdown}s...
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Thank you for your support!</p>
                            </div>
                        )}
                   </motion.div>
               ) : (
                    <motion.div
                       key="content"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: 0.1 }}
                    >
                        <div className="prose prose-lg lg:prose-xl max-w-none text-gray-800 whitespace-pre-wrap break-words">
                            {website.description}
                        </div>

                        {/* Display Attached File Names */}
                        {renderAttachments(website.files, FileText)}
                        {renderAttachments(website.images, ImageIcon)}

                     </motion.div>
               )}
           </CardContent>
            <CardFooter className="bg-gray-50/50 p-4 text-xs text-gray-500 justify-center border-t border-purple-100">
                Created by: {website.owner || 'Unknown'}
            </CardFooter>
         </Card>
      </motion.div>
    </div>
  );
};

export default PublicPage;
  