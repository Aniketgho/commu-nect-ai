import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { usePhoneNumbers, PhoneNumber } from "@/hooks/usePhoneNumbers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Phone,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { AddPhoneDialog } from "@/components/phone/AddPhoneDialog";
import { format } from "date-fns";

const PhoneNumbers = () => {
  const {
    phoneNumbers,
    loading,
    addPhoneNumber,
    updatePhoneNumber,
    deletePhoneNumber,
    verifyPhoneNumber,
  } = usePhoneNumbers();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<PhoneNumber | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleEdit = (phone: PhoneNumber) => {
    setSelectedPhone(phone);
    setEditLabel(phone.label);
    setEditDialogOpen(true);
  };

  const handleDelete = (phone: PhoneNumber) => {
    setSelectedPhone(phone);
    setDeleteDialogOpen(true);
  };

  const handleVerify = (phone: PhoneNumber) => {
    setSelectedPhone(phone);
    setVerificationCode("");
    setVerifyDialogOpen(true);
  };

  const confirmEdit = async () => {
    if (!selectedPhone || !editLabel.trim()) return;
    setActionLoading(true);
    try {
      await updatePhoneNumber(selectedPhone.id, { label: editLabel.trim() });
      setEditDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedPhone) return;
    setActionLoading(true);
    try {
      await deletePhoneNumber(selectedPhone.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setActionLoading(false);
    }
  };

  const confirmVerify = async () => {
    if (!selectedPhone) return;
    // In a real implementation, you would verify the code with WhatsApp API
    // For now, we'll just mark it as verified
    setActionLoading(true);
    try {
      await verifyPhoneNumber(selectedPhone.id);
      setVerifyDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Phone Numbers</h1>
            <p className="text-muted-foreground mt-1">
              Manage your WhatsApp Business phone numbers
            </p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Phone Number
          </Button>
        </div>

        {/* Phone Numbers Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : phoneNumbers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No phone numbers yet
              </h3>
              <p className="text-muted-foreground text-center max-w-sm mb-4">
                Add your first phone number to start connecting with customers via WhatsApp.
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Phone Number
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {phoneNumbers.map((phone) => (
              <Card key={phone.id} className="relative overflow-hidden">
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${
                    phone.status === "active"
                      ? "bg-green-500"
                      : phone.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-muted-foreground"
                  }`}
                />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        {phone.phone_number}
                      </CardTitle>
                      <CardDescription>{phone.label}</CardDescription>
                    </div>
                    {getStatusBadge(phone.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Country</p>
                      <p className="font-medium">{phone.country_code || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Added</p>
                      <p className="font-medium">
                        {format(new Date(phone.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  {phone.verified_at && (
                    <div className="flex items-center gap-2 text-sm text-green-500">
                      <Shield className="h-4 w-4" />
                      Verified on {format(new Date(phone.verified_at), "MMM d, yyyy")}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {phone.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleVerify(phone)}
                        className="flex-1"
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(phone)}
                      className={phone.status !== "pending" ? "flex-1" : ""}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(phone)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex items-start gap-4 py-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                WhatsApp Business API Integration
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Verified phone numbers can send and receive WhatsApp messages. Pending numbers
                need to be verified via SMS before they can be used for messaging.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Phone Dialog */}
      <AddPhoneDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={addPhoneNumber}
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Phone Number</DialogTitle>
            <DialogDescription>
              Update the label for {selectedPhone?.phone_number}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-label">Label</Label>
              <Input
                id="edit-label"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                placeholder="e.g., Business, Support, Sales"
                disabled={actionLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={confirmEdit} disabled={actionLoading || !editLabel.trim()}>
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Phone Number</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPhone?.phone_number}? This action
              cannot be undone and will disconnect this number from WhatsApp.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Verify Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Verify Phone Number
            </DialogTitle>
            <DialogDescription>
              Enter the verification code sent to {selectedPhone?.phone_number} via SMS.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="text-center text-2xl tracking-widest"
                maxLength={6}
                disabled={actionLoading}
              />
              <p className="text-xs text-muted-foreground text-center">
                Didn't receive a code?{" "}
                <button className="text-primary hover:underline">Resend SMS</button>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVerifyDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={confirmVerify} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Number"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PhoneNumbers;
