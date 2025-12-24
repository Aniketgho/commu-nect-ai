import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PhoneNumber {
  id: string;
  user_id: string;
  phone_number: string;
  label: string;
  status: string;
  country_code: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export function usePhoneNumbers() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoneId, setSelectedPhoneId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPhoneNumbers = async () => {
    try {
      const { data, error } = await supabase
        .from('phone_numbers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const phones = (data || []) as PhoneNumber[];
      setPhoneNumbers(phones);
      
      if (phones.length > 0 && !selectedPhoneId) {
        setSelectedPhoneId(phones[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching phone numbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPhoneNumber = async (phoneNumber: string, label: string, countryCode?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('phone_numbers')
        .insert({
          user_id: user.id,
          phone_number: phoneNumber,
          label,
          country_code: countryCode || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      const newPhone = data as PhoneNumber;
      setPhoneNumbers(prev => [newPhone, ...prev]);
      setSelectedPhoneId(newPhone.id);

      toast({
        title: "Phone number added",
        description: "Your phone number has been added successfully.",
      });

      return newPhone;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add phone number",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePhoneNumber = async (id: string, updates: Partial<Pick<PhoneNumber, 'phone_number' | 'label' | 'status'>>) => {
    try {
      const { error } = await supabase
        .from('phone_numbers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setPhoneNumbers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

      toast({
        title: "Phone number updated",
        description: "Your phone number has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update phone number",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePhoneNumber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('phone_numbers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPhoneNumbers(prev => {
        const updated = prev.filter(p => p.id !== id);
        if (selectedPhoneId === id && updated.length > 0) {
          setSelectedPhoneId(updated[0].id);
        } else if (updated.length === 0) {
          setSelectedPhoneId(null);
        }
        return updated;
      });

      toast({
        title: "Phone number deleted",
        description: "Your phone number has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete phone number",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyPhoneNumber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('phone_numbers')
        .update({ 
          status: 'active',
          verified_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setPhoneNumbers(prev => prev.map(p => 
        p.id === id ? { ...p, status: 'active', verified_at: new Date().toISOString() } : p
      ));

      toast({
        title: "Phone verified",
        description: "Your phone number has been verified successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify phone number",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const selectedPhone = phoneNumbers.find(p => p.id === selectedPhoneId) || null;

  return {
    phoneNumbers,
    loading,
    selectedPhone,
    selectedPhoneId,
    setSelectedPhoneId,
    addPhoneNumber,
    updatePhoneNumber,
    deletePhoneNumber,
    verifyPhoneNumber,
    refetch: fetchPhoneNumbers,
  };
}
