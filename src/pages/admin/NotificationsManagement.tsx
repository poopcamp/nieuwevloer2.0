
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BellRing, Check, Clock, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Nieuwe offerte aanvraag',
    description: 'Een nieuwe offerte is aangevraagd door Jan Janssens.',
    timestamp: '15 minuten geleden',
    read: false,
    type: 'lead'
  },
  {
    id: '2',
    title: 'Opvolgherinnering',
    description: 'Herinnering om Piet Peters te contacteren over zijn badkamerrenovatie.',
    timestamp: '1 uur geleden',
    read: false,
    type: 'reminder'
  },
  {
    id: '3',
    title: 'GDPR verzoek ontvangen',
    description: 'Een klant heeft een verzoek ingediend om zijn gegevens te verwijderen.',
    timestamp: '3 uur geleden',
    read: true,
    type: 'gdpr'
  },
  {
    id: '4',
    title: 'Voorraad waarschuwing',
    description: 'De voorraad van 60x60 tegels is bijna op.',
    timestamp: 'Gisteren',
    read: true,
    type: 'inventory'
  },
];

const NotificationsManagement = () => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread' 
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === activeTab);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notificaties</h1>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Alles als gelezen markeren
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BellRing className="mr-2 h-5 w-5" />
            Notificatie Beheer
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-primary" variant="secondary">
                {unreadCount} ongelezen
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Alle Notificaties</TabsTrigger>
              <TabsTrigger value="unread">Ongelezen</TabsTrigger>
              <TabsTrigger value="lead">Leads</TabsTrigger>
              <TabsTrigger value="reminder">Herinneringen</TabsTrigger>
              <TabsTrigger value="gdpr">GDPR</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Geen notificaties gevonden
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-lg border ${notification.read ? 'bg-card' : 'bg-muted/30'}`}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <h4 className="font-semibold">{notification.title}</h4>
                            {!notification.read && (
                              <Badge className="ml-2" variant="default">Nieuw</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {notification.timestamp}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsManagement;
