import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseAdvanceForm } from "@/components/forms/expense-advance-form";
import { MissionOrderForm } from "@/components/forms/mission-order-form";
import { TimesheetForm } from "@/components/forms/timesheet-form";
import { PerformanceEvaluationForm } from "@/components/forms/performance-evaluation-form";
import { SupplierClientForm } from "@/components/forms/supplier-client-form";
// Import existing forms
// import { PurchaseRequestForm } from "@/components/forms/purchase-request-form";
// import { IncidentReportForm } from "@/components/forms/incident-report-form";  
// import { LeaveRequestForm } from "@/components/forms/leave-request-form";
import { FileText, Users, DollarSign, Clock, Star, Building2 } from "lucide-react";

export default function Forms() {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setActiveForm(null);
  };

  const handleFormCancel = () => {
    setActiveForm(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Formulaires Business</h1>
        <p className="text-muted-foreground mt-2">
          Formulaires business couramment utilisés en entreprise avec validation et interface propre
        </p>
      </div>

      {activeForm ? (
        <div className="space-y-6">
          {activeForm === "expense-advance" && (
            <ExpenseAdvanceForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
          )}
          {activeForm === "mission-order" && (
            <MissionOrderForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
          )}
          {activeForm === "timesheet" && (
            <TimesheetForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
          )}
          {activeForm === "performance" && (
            <PerformanceEvaluationForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
          )}
          {activeForm === "supplier-client" && (
            <SupplierClientForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
          )}
          {/* Additional forms to be added */}
        </div>
      ) : (
        <Tabs defaultValue="hr" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hr">RH</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="admin">Administration</TabsTrigger>
            <TabsTrigger value="procurement">Achats</TabsTrigger>
          </TabsList>

          <TabsContent value="hr" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Demande de congé
                  </CardTitle>
                  <CardDescription>
                    Formulaire pour solliciter un congé ou une absence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveForm("leave-request")}>
                    Ouvrir le formulaire
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Fiche de pointage
                  </CardTitle>
                  <CardDescription>
                    Enregistrement des heures de travail et absences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveForm("timesheet")}>
                    Ouvrir le formulaire
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Évaluation du personnel
                  </CardTitle>
                  <CardDescription>
                    Fiche d'évaluation annuelle de performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveForm("performance")}>
                    Ouvrir le formulaire
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Demande d'avance/remboursement
                  </CardTitle>
                  <CardDescription>
                    Demande d'avance sur frais ou de remboursement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveForm("expense-advance")}>
                    Ouvrir le formulaire
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Fournisseur/Client
                  </CardTitle>
                  <CardDescription>
                    Création et mise à jour des bases partenaires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveForm("supplier-client")}>
                    Ouvrir le formulaire
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Ordre de mission
                  </CardTitle>
                  <CardDescription>
                    Autorisation formelle pour déplacement professionnel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveForm("mission-order")}>
                    Ouvrir le formulaire
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Rapport d'incident
                  </CardTitle>
                  <CardDescription>
                    Signalement d'incident ou d'accident
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveForm("incident-report")}>
                    Ouvrir le formulaire
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="procurement" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Demande d'achat
                  </CardTitle>
                  <CardDescription>
                    Sollicitation d'autorisation d'achat
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveForm("purchase-request")}>
                    Ouvrir le formulaire
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}