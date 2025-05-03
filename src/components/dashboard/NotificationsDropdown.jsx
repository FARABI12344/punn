
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Removed the duplicate import: import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Trash2, Info, AlertTriangle, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Import cn for ScrollArea styling

const getIconForType = (type) => {
    switch (type) {
        case 'destructive':
            return <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />;
        case 'appeal':
            return <MessageSquare className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />;
        case 'info':
        default:
            return <Info className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />;
    }
};

// Mocking Radix Scroll Area Primitives for component structure
const ScrollAreaPrimitive = {
    Root: React.forwardRef((props, ref) => <div ref={ref} {...props} style={{ overflow: 'hidden', ...props.style }} />), // Changed overflow to hidden for Root
    Viewport: React.forwardRef((props, ref) => <div ref={ref} {...props} style={{ height: '100%', width: '100%', overflowY: 'auto', ...props.style }} />), // Added overflowY auto to Viewport
    Scrollbar: React.forwardRef(({ orientation, ...props }, ref) => <div data-orientation={orientation} ref={ref} {...props} />), // Added orientation prop pass-through
    Thumb: React.forwardRef((props, ref) => <div ref={ref} {...props} />),
    Corner: React.forwardRef((props, ref) => <div ref={ref} {...props} />),
};


// Define ScrollArea components locally
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)} // Use cn here
    {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className
      )}
    {...props}>
    <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.Scrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.Scrollbar.displayName


// Now define the NotificationsDropdown component
const NotificationsDropdown = ({ notifications, onClearNotifications }) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-purple-700 hover:bg-purple-100 relative focus-visible:ring-primary">
                    <Bell />
                    {unreadCount > 0 && (
                        <motion.span
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           className="notification-badge"
                         >
                           {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 shadow-cartoon-hard border-purple-300">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                     {notifications.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={onClearNotifications} className="text-xs h-auto py-0.5 px-1.5 text-red-500 hover:bg-red-50">
                            <Trash2 className="h-3 w-3 mr-1"/> Clear All
                        </Button>
                     )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 {/* Use the locally defined ScrollArea */}
                <ScrollArea className="h-[300px] pr-3">
                    {notifications.length === 0 ? (
                        <DropdownMenuItem disabled className="text-center text-gray-400 py-4">No new notifications</DropdownMenuItem>
                    ) : (
                         // Render newest first
                        notifications.slice().reverse().map((notification) => (
                            <DropdownMenuItem key={notification.id} className="flex items-start text-sm text-gray-700 py-2 px-3 whitespace-normal cursor-default focus:bg-purple-50">
                                {getIconForType(notification.type)}
                                <div className="flex-1">
                                    <p>{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(notification.timestamp).toLocaleString()}</p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export default NotificationsDropdown;

// Export the locally defined ScrollArea components if needed elsewhere, though likely not
export { ScrollArea, ScrollBar };
  