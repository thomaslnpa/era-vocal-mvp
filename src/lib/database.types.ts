export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  eravocal: {
    Tables: {
      acheteurs: {
        Row: {
          agent_id: string
          budget: string | null
          created_at: string
          delai_acquisition:
            | Database["eravocal"]["Enums"]["delai_acquisition"]
            | null
          details: Json
          email: string | null
          financement_statut:
            | Database["eravocal"]["Enums"]["financement_statut"]
            | null
          freins: string[]
          id: string
          motivations: string[]
          nom: string
          prenom: string | null
          projet: Database["eravocal"]["Enums"]["projet_type"] | null
          score: Database["eravocal"]["Enums"]["score_couleur"] | null
          score_force: boolean
          secteur: string | null
          telephone: string | null
          type_bien: string | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          budget?: string | null
          created_at?: string
          delai_acquisition?:
            | Database["eravocal"]["Enums"]["delai_acquisition"]
            | null
          details?: Json
          email?: string | null
          financement_statut?:
            | Database["eravocal"]["Enums"]["financement_statut"]
            | null
          freins?: string[]
          id?: string
          motivations?: string[]
          nom: string
          prenom?: string | null
          projet?: Database["eravocal"]["Enums"]["projet_type"] | null
          score?: Database["eravocal"]["Enums"]["score_couleur"] | null
          score_force?: boolean
          secteur?: string | null
          telephone?: string | null
          type_bien?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          budget?: string | null
          created_at?: string
          delai_acquisition?:
            | Database["eravocal"]["Enums"]["delai_acquisition"]
            | null
          details?: Json
          email?: string | null
          financement_statut?:
            | Database["eravocal"]["Enums"]["financement_statut"]
            | null
          freins?: string[]
          id?: string
          motivations?: string[]
          nom?: string
          prenom?: string | null
          projet?: Database["eravocal"]["Enums"]["projet_type"] | null
          score?: Database["eravocal"]["Enums"]["score_couleur"] | null
          score_force?: boolean
          secteur?: string | null
          telephone?: string | null
          type_bien?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "acheteurs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          actif: boolean
          id: string
          nom: string
          telephone_whatsapp: string
        }
        Insert: {
          actif?: boolean
          id?: string
          nom: string
          telephone_whatsapp: string
        }
        Update: {
          actif?: boolean
          id?: string
          nom?: string
          telephone_whatsapp?: string
        }
        Relationships: []
      }
      debriefs: {
        Row: {
          acheteur_id: string | null
          agent_id: string
          created_at: string
          extraction: Json | null
          id: string
          media_url: string | null
          transcription: string | null
          type: Database["eravocal"]["Enums"]["debrief_type"]
        }
        Insert: {
          acheteur_id?: string | null
          agent_id: string
          created_at?: string
          extraction?: Json | null
          id?: string
          media_url?: string | null
          transcription?: string | null
          type: Database["eravocal"]["Enums"]["debrief_type"]
        }
        Update: {
          acheteur_id?: string | null
          agent_id?: string
          created_at?: string
          extraction?: Json | null
          id?: string
          media_url?: string | null
          transcription?: string | null
          type?: Database["eravocal"]["Enums"]["debrief_type"]
        }
        Relationships: [
          {
            foreignKeyName: "debriefs_acheteur_id_fkey"
            columns: ["acheteur_id"]
            isOneToOne: false
            referencedRelation: "acheteurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debriefs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      rappels: {
        Row: {
          acheteur_id: string
          agent_id: string
          canal: string | null
          contexte: string | null
          created_at: string
          echeance: string
          id: string
          message_suggere: string | null
          statut: string
          termine_le: string | null
          texte: string
          updated_at: string
        }
        Insert: {
          acheteur_id: string
          agent_id: string
          canal?: string | null
          contexte?: string | null
          created_at?: string
          echeance?: string
          id?: string
          message_suggere?: string | null
          statut?: string
          termine_le?: string | null
          texte: string
          updated_at?: string
        }
        Update: {
          acheteur_id?: string
          agent_id?: string
          canal?: string | null
          contexte?: string | null
          created_at?: string
          echeance?: string
          id?: string
          message_suggere?: string | null
          statut?: string
          termine_le?: string | null
          texte?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rappels_acheteur_id_fkey"
            columns: ["acheteur_id"]
            isOneToOne: false
            referencedRelation: "acheteurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rappels_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          acheteur_actif_id: string | null
          agent_id: string
          updated_at: string
        }
        Insert: {
          acheteur_actif_id?: string | null
          agent_id: string
          updated_at?: string
        }
        Update: {
          acheteur_actif_id?: string | null
          agent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_acheteur_actif_id_fkey"
            columns: ["acheteur_actif_id"]
            isOneToOne: false
            referencedRelation: "acheteurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      validations_en_attente: {
        Row: {
          acheteur_id: string | null
          agent_id: string
          brouillon: Json | null
          candidats: Json | null
          champs_manquants: string[]
          created_at: string
          id: string
          statut: Database["eravocal"]["Enums"]["validation_statut"]
          type: Database["eravocal"]["Enums"]["validation_type"]
        }
        Insert: {
          acheteur_id?: string | null
          agent_id: string
          brouillon?: Json | null
          candidats?: Json | null
          champs_manquants?: string[]
          created_at?: string
          id?: string
          statut?: Database["eravocal"]["Enums"]["validation_statut"]
          type: Database["eravocal"]["Enums"]["validation_type"]
        }
        Update: {
          acheteur_id?: string | null
          agent_id?: string
          brouillon?: Json | null
          candidats?: Json | null
          champs_manquants?: string[]
          created_at?: string
          id?: string
          statut?: Database["eravocal"]["Enums"]["validation_statut"]
          type?: Database["eravocal"]["Enums"]["validation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "validations_en_attente_acheteur_id_fkey"
            columns: ["acheteur_id"]
            isOneToOne: false
            referencedRelation: "acheteurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validations_en_attente_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_acheteurs: {
        Args: {
          p_agent_id: string
          p_nom?: string
          p_prenom?: string
          p_telephone?: string
        }
        Returns: {
          budget: string
          created_at: string
          id: string
          nom: string
          prenom: string
          score: Database["eravocal"]["Enums"]["score_couleur"]
          secteur: string
          similarite: number
          telephone: string
          type_bien: string
        }[]
      }
    }
    Enums: {
      debrief_type: "texte" | "vocal"
      delai_acquisition:
        | "immediat"
        | "moins_d_un_mois"
        | "un_a_six_mois"
        | "plus_de_six_mois"
      financement_statut: "solide" | "en_cours" | "aucun" | "inconnu"
      projet_type: "residence_principale" | "investissement"
      score_couleur: "vert" | "orange" | "rouge"
      validation_statut: "en_attente" | "validee" | "annulee" | "remplacee"
      validation_type: "creation" | "mise_a_jour" | "choix_homonyme" | "rappel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  eravocal: {
    Enums: {
      debrief_type: ["texte", "vocal"],
      delai_acquisition: [
        "immediat",
        "moins_d_un_mois",
        "un_a_six_mois",
        "plus_de_six_mois",
      ],
      financement_statut: ["solide", "en_cours", "aucun", "inconnu"],
      projet_type: ["residence_principale", "investissement"],
      score_couleur: ["vert", "orange", "rouge"],
      validation_statut: ["en_attente", "validee", "annulee", "remplacee"],
      validation_type: ["creation", "mise_a_jour", "choix_homonyme", "rappel"],
    },
  },
} as const
