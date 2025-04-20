export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          company_address: string
          company_email: string
          company_name: string
          company_phone: string
          company_vat: string
          created_at: string
          id: string
          privacy_policy_last_updated: string
          showroom_visit_enabled: boolean | null
          showroom_visit_text: string | null
          terms_last_updated: string
          updated_at: string
        }
        Insert: {
          company_address?: string
          company_email?: string
          company_name?: string
          company_phone?: string
          company_vat?: string
          created_at?: string
          id?: string
          privacy_policy_last_updated?: string
          showroom_visit_enabled?: boolean | null
          showroom_visit_text?: string | null
          terms_last_updated?: string
          updated_at?: string
        }
        Update: {
          company_address?: string
          company_email?: string
          company_name?: string
          company_phone?: string
          company_vat?: string
          created_at?: string
          id?: string
          privacy_policy_last_updated?: string
          showroom_visit_enabled?: boolean | null
          showroom_visit_text?: string | null
          terms_last_updated?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          publish_date: string | null
          published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          publish_date?: string | null
          published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          publish_date?: string | null
          published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      calculator_rates: {
        Row: {
          created_at: string
          id: string
          name: string
          project_type: string
          rate_key: string
          section_id: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          project_type: string
          rate_key: string
          section_id: string
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          project_type?: string
          rate_key?: string
          section_id?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      config_blocks: {
        Row: {
          created_at: string
          default_value: string | null
          field_type: string
          id: string
          is_active: boolean
          options: Json | null
          placeholder: string | null
          project_type_id: string
          required: boolean
          sort_order: number
          title: string
          tooltip: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_value?: string | null
          field_type: string
          id?: string
          is_active?: boolean
          options?: Json | null
          placeholder?: string | null
          project_type_id: string
          required?: boolean
          sort_order: number
          title: string
          tooltip?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_value?: string | null
          field_type?: string
          id?: string
          is_active?: boolean
          options?: Json | null
          placeholder?: string | null
          project_type_id?: string
          required?: boolean
          sort_order?: number
          title?: string
          tooltip?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "config_blocks_project_type_id_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "project_types"
            referencedColumns: ["id"]
          },
        ]
      }
      config_field_values: {
        Row: {
          config_id: string
          created_at: string
          field_id: string
          field_value: string
          id: string
          updated_at: string
        }
        Insert: {
          config_id: string
          created_at?: string
          field_id: string
          field_value: string
          id?: string
          updated_at?: string
        }
        Update: {
          config_id?: string
          created_at?: string
          field_id?: string
          field_value?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "config_field_values_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_field_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "config_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      configurations: {
        Row: {
          additional_notes: string | null
          address_city: string | null
          address_street: string | null
          bathroom_options: Json | null
          bathroom_tile_size: string | null
          created_at: string
          email: string
          floor_type: string | null
          full_bathroom_renovation: boolean | null
          id: string
          laatste_contactmoment: string | null
          lead_score: number | null
          name: string
          need_plinths: boolean | null
          needs_chape: boolean | null
          needs_electrician: boolean | null
          opvolging_gestopt: boolean | null
          other_description: string | null
          phone: string
          project_image_url: string | null
          project_type: string | null
          selected_inspiration_style_id: number | null
          selected_inspiration_style_title: string | null
          shower_nis: boolean | null
          shower_nis_custom_size: string | null
          shower_nis_size: string | null
          square_meters: number | null
          tile_cost: number | null
          tile_price_per_sqm: number | null
          tile_size: string | null
          total_price: number | null
          updated_at: string
          wall_tile_size: string | null
          wall_type: string | null
          wants_showroom_visit: boolean | null
          wants_site_visit: boolean | null
          wants_to_buy_tiles: boolean | null
        }
        Insert: {
          additional_notes?: string | null
          address_city?: string | null
          address_street?: string | null
          bathroom_options?: Json | null
          bathroom_tile_size?: string | null
          created_at?: string
          email: string
          floor_type?: string | null
          full_bathroom_renovation?: boolean | null
          id?: string
          laatste_contactmoment?: string | null
          lead_score?: number | null
          name: string
          need_plinths?: boolean | null
          needs_chape?: boolean | null
          needs_electrician?: boolean | null
          opvolging_gestopt?: boolean | null
          other_description?: string | null
          phone: string
          project_image_url?: string | null
          project_type?: string | null
          selected_inspiration_style_id?: number | null
          selected_inspiration_style_title?: string | null
          shower_nis?: boolean | null
          shower_nis_custom_size?: string | null
          shower_nis_size?: string | null
          square_meters?: number | null
          tile_cost?: number | null
          tile_price_per_sqm?: number | null
          tile_size?: string | null
          total_price?: number | null
          updated_at?: string
          wall_tile_size?: string | null
          wall_type?: string | null
          wants_showroom_visit?: boolean | null
          wants_site_visit?: boolean | null
          wants_to_buy_tiles?: boolean | null
        }
        Update: {
          additional_notes?: string | null
          address_city?: string | null
          address_street?: string | null
          bathroom_options?: Json | null
          bathroom_tile_size?: string | null
          created_at?: string
          email?: string
          floor_type?: string | null
          full_bathroom_renovation?: boolean | null
          id?: string
          laatste_contactmoment?: string | null
          lead_score?: number | null
          name?: string
          need_plinths?: boolean | null
          needs_chape?: boolean | null
          needs_electrician?: boolean | null
          opvolging_gestopt?: boolean | null
          other_description?: string | null
          phone?: string
          project_image_url?: string | null
          project_type?: string | null
          selected_inspiration_style_id?: number | null
          selected_inspiration_style_title?: string | null
          shower_nis?: boolean | null
          shower_nis_custom_size?: string | null
          shower_nis_size?: string | null
          square_meters?: number | null
          tile_cost?: number | null
          tile_price_per_sqm?: number | null
          tile_size?: string | null
          total_price?: number | null
          updated_at?: string
          wall_tile_size?: string | null
          wall_type?: string | null
          wants_showroom_visit?: boolean | null
          wants_site_visit?: boolean | null
          wants_to_buy_tiles?: boolean | null
        }
        Relationships: []
      }
      configurator_fields: {
        Row: {
          conditional_logic: Json | null
          created_at: string
          default_value: Json | null
          description: string | null
          field_type: string
          id: string
          is_active: boolean
          is_required: boolean
          key: string
          label: string
          options: Json | null
          placeholder: string | null
          price_impact: Json | null
          sort_order: number
          step_id: string
          updated_at: string
          validation_rules: Json | null
        }
        Insert: {
          conditional_logic?: Json | null
          created_at?: string
          default_value?: Json | null
          description?: string | null
          field_type: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          key: string
          label: string
          options?: Json | null
          placeholder?: string | null
          price_impact?: Json | null
          sort_order?: number
          step_id: string
          updated_at?: string
          validation_rules?: Json | null
        }
        Update: {
          conditional_logic?: Json | null
          created_at?: string
          default_value?: Json | null
          description?: string | null
          field_type?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          key?: string
          label?: string
          options?: Json | null
          placeholder?: string | null
          price_impact?: Json | null
          sort_order?: number
          step_id?: string
          updated_at?: string
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "configurator_fields_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "configurator_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      configurator_pricing: {
        Row: {
          base_price_per_sqm: number
          created_at: string
          cutting_loss_percentage: number
          id: string
          internal_cost_per_sqm: number
          minimum_price: number
          pricing_settings: Json | null
          project_type_id: string | null
          updated_at: string
        }
        Insert: {
          base_price_per_sqm?: number
          created_at?: string
          cutting_loss_percentage?: number
          id?: string
          internal_cost_per_sqm?: number
          minimum_price?: number
          pricing_settings?: Json | null
          project_type_id?: string | null
          updated_at?: string
        }
        Update: {
          base_price_per_sqm?: number
          created_at?: string
          cutting_loss_percentage?: number
          id?: string
          internal_cost_per_sqm?: number
          minimum_price?: number
          pricing_settings?: Json | null
          project_type_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "configurator_pricing_project_type_id_fkey"
            columns: ["project_type_id"]
            isOneToOne: true
            referencedRelation: "configurator_project_types"
            referencedColumns: ["id"]
          },
        ]
      }
      configurator_project_types: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          key: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          key: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      configurator_steps: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          key: string
          project_type_id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          key: string
          project_type_id: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          key?: string
          project_type_id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "configurator_steps_project_type_id_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "configurator_project_types"
            referencedColumns: ["id"]
          },
        ]
      }
      configurator_submissions: {
        Row: {
          additional_files: Json | null
          calculated_price: number | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          form_data: Json
          id: string
          lead_score: number | null
          notes: string | null
          project_type_id: string | null
          selected_visit_options: Json | null
          status: string | null
          updated_at: string
        }
        Insert: {
          additional_files?: Json | null
          calculated_price?: number | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          form_data: Json
          id?: string
          lead_score?: number | null
          notes?: string | null
          project_type_id?: string | null
          selected_visit_options?: Json | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          additional_files?: Json | null
          calculated_price?: number | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          form_data?: Json
          id?: string
          lead_score?: number | null
          notes?: string | null
          project_type_id?: string | null
          selected_visit_options?: Json | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "configurator_submissions_project_type_id_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "configurator_project_types"
            referencedColumns: ["id"]
          },
        ]
      }
      configurator_visit_options: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          key: string
          name: string
          project_type_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          key: string
          name: string
          project_type_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          project_type_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "configurator_visit_options_project_type_id_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "configurator_project_types"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          additional_notes: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          project_type: string | null
          receives_newsletter: boolean | null
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          project_type?: string | null
          receives_newsletter?: boolean | null
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          project_type?: string | null
          receives_newsletter?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      extended_calculator_options: {
        Row: {
          conditional_logic: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          internal_cost: number
          is_active: boolean
          name: string
          option_type: string
          price_addition: number
          project_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          conditional_logic?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          internal_cost?: number
          is_active?: boolean
          name: string
          option_type: string
          price_addition?: number
          project_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          conditional_logic?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          internal_cost?: number
          is_active?: boolean
          name?: string
          option_type?: string
          price_addition?: number
          project_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "extended_calculator_options_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "extended_calculator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      extended_calculator_pricing: {
        Row: {
          base_price_per_sqm: number
          created_at: string
          cutting_loss_percentage: number
          display_settings: Json | null
          id: string
          internal_base_cost_per_sqm: number
          minimum_price: number
          project_id: string
          updated_at: string
        }
        Insert: {
          base_price_per_sqm?: number
          created_at?: string
          cutting_loss_percentage?: number
          display_settings?: Json | null
          id?: string
          internal_base_cost_per_sqm?: number
          minimum_price?: number
          project_id: string
          updated_at?: string
        }
        Update: {
          base_price_per_sqm?: number
          created_at?: string
          cutting_loss_percentage?: number
          display_settings?: Json | null
          id?: string
          internal_base_cost_per_sqm?: number
          minimum_price?: number
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "extended_calculator_pricing_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "extended_calculator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      extended_calculator_projects: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          key: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          key: string
          name: string
          sort_order: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      extended_calculator_questions: {
        Row: {
          affects_price: boolean
          conditional_logic: Json | null
          created_at: string
          default_value: string | null
          field_type: string
          help_text: string | null
          id: string
          internal_cost_impact: Json | null
          is_active: boolean
          is_required: boolean
          options: Json | null
          price_impact: Json | null
          project_id: string
          question_text: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          affects_price?: boolean
          conditional_logic?: Json | null
          created_at?: string
          default_value?: string | null
          field_type: string
          help_text?: string | null
          id?: string
          internal_cost_impact?: Json | null
          is_active?: boolean
          is_required?: boolean
          options?: Json | null
          price_impact?: Json | null
          project_id: string
          question_text: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          affects_price?: boolean
          conditional_logic?: Json | null
          created_at?: string
          default_value?: string | null
          field_type?: string
          help_text?: string | null
          id?: string
          internal_cost_impact?: Json | null
          is_active?: boolean
          is_required?: boolean
          options?: Json | null
          price_impact?: Json | null
          project_id?: string
          question_text?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "extended_calculator_questions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "extended_calculator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      extended_calculator_submissions: {
        Row: {
          calculated_price: number
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          internal_cost: number
          lead_score: number
          notes: string | null
          project_id: string
          project_image_url: string | null
          question_responses: Json | null
          receives_newsletter: boolean
          selected_options: Json | null
          selected_tile_format_id: string | null
          selected_tile_style_id: string | null
          square_meters: number
          updated_at: string
          wants_showroom_visit: boolean
          wants_site_visit: boolean
        }
        Insert: {
          calculated_price: number
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          internal_cost: number
          lead_score?: number
          notes?: string | null
          project_id: string
          project_image_url?: string | null
          question_responses?: Json | null
          receives_newsletter?: boolean
          selected_options?: Json | null
          selected_tile_format_id?: string | null
          selected_tile_style_id?: string | null
          square_meters: number
          updated_at?: string
          wants_showroom_visit?: boolean
          wants_site_visit?: boolean
        }
        Update: {
          calculated_price?: number
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          internal_cost?: number
          lead_score?: number
          notes?: string | null
          project_id?: string
          project_image_url?: string | null
          question_responses?: Json | null
          receives_newsletter?: boolean
          selected_options?: Json | null
          selected_tile_format_id?: string | null
          selected_tile_style_id?: string | null
          square_meters?: number
          updated_at?: string
          wants_showroom_visit?: boolean
          wants_site_visit?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "extended_calculator_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "extended_calculator_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extended_calculator_submissions_selected_tile_format_id_fkey"
            columns: ["selected_tile_format_id"]
            isOneToOne: false
            referencedRelation: "extended_calculator_tile_formats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extended_calculator_submissions_selected_tile_style_id_fkey"
            columns: ["selected_tile_style_id"]
            isOneToOne: false
            referencedRelation: "extended_calculator_tile_styles"
            referencedColumns: ["id"]
          },
        ]
      }
      extended_calculator_tile_formats: {
        Row: {
          created_at: string
          description: string | null
          dimensions: string
          id: string
          image_url: string | null
          internal_cost_per_sqm: number
          is_active: boolean
          name: string
          price_multiplier: number
          project_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          dimensions: string
          id?: string
          image_url?: string | null
          internal_cost_per_sqm?: number
          is_active?: boolean
          name: string
          price_multiplier?: number
          project_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          dimensions?: string
          id?: string
          image_url?: string | null
          internal_cost_per_sqm?: number
          is_active?: boolean
          name?: string
          price_multiplier?: number
          project_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "extended_calculator_tile_formats_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "extended_calculator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      extended_calculator_tile_styles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          internal_cost_per_sqm: number
          is_active: boolean
          name: string
          price_multiplier: number
          project_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          internal_cost_per_sqm?: number
          is_active?: boolean
          name: string
          price_multiplier?: number
          project_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          internal_cost_per_sqm?: number
          is_active?: boolean
          name?: string
          price_multiplier?: number
          project_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "extended_calculator_tile_styles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "extended_calculator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      extra_options: {
        Row: {
          created_at: string
          id: string
          name: string
          price: number
          project_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price: number
          project_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price?: number
          project_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gdpr_requests: {
        Row: {
          admin_notes: string | null
          completed_at: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          request_type: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          request_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          request_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          alt_text: string
          created_at: string
          id: string
          updated_at: string
          url: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          id?: string
          updated_at?: string
          url: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          id?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      holiday_discounts: {
        Row: {
          created_at: string
          discount_percentage: number
          enabled: boolean
          id: string
          name: string
          updated_at: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          created_at?: string
          discount_percentage?: number
          enabled?: boolean
          id?: string
          name: string
          updated_at?: string
          valid_from: string
          valid_until: string
        }
        Update: {
          created_at?: string
          discount_percentage?: number
          enabled?: boolean
          id?: string
          name?: string
          updated_at?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      inspiration_tiles: {
        Row: {
          colorpalette: string[]
          created_at: string
          description: string
          id: string
          image: string
          popularity: number
          title: string
          updated_at: string
        }
        Insert: {
          colorpalette?: string[]
          created_at?: string
          description: string
          id?: string
          image: string
          popularity?: number
          title: string
          updated_at?: string
        }
        Update: {
          colorpalette?: string[]
          created_at?: string
          description?: string
          id?: string
          image?: string
          popularity?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      monthly_projects: {
        Row: {
          client_name: string
          created_at: string
          description: string
          id: string
          image_url: string
          location: string
          title: string
          updated_at: string
        }
        Insert: {
          client_name: string
          created_at?: string
          description: string
          id?: string
          image_url: string
          location: string
          title: string
          updated_at?: string
        }
        Update: {
          client_name?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          location?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pricing_info: {
        Row: {
          base_bathroom_price: number
          base_kitchen_price: number
          base_m2_price: number
          chape_primer_included: boolean
          created_at: string
          cutting_loss_percentage: number | null
          discount_percentage: number
          floor_heating_surcharge: number | null
          id: string
          kit_included: boolean
          lijm_included: boolean
          minimum_price: number | null
          ontkoppelingsmat_included: boolean
          plinth_price_per_meter: number | null
          price_info_text: string
          tile_on_tile_surcharge: number | null
          updated_at: string
          vloerverwarming_included: boolean
          voegmiddel_included: boolean
          waterafstotende_voeg_included: boolean
        }
        Insert: {
          base_bathroom_price?: number
          base_kitchen_price?: number
          base_m2_price?: number
          chape_primer_included?: boolean
          created_at?: string
          cutting_loss_percentage?: number | null
          discount_percentage?: number
          floor_heating_surcharge?: number | null
          id?: string
          kit_included?: boolean
          lijm_included?: boolean
          minimum_price?: number | null
          ontkoppelingsmat_included?: boolean
          plinth_price_per_meter?: number | null
          price_info_text?: string
          tile_on_tile_surcharge?: number | null
          updated_at?: string
          vloerverwarming_included?: boolean
          voegmiddel_included?: boolean
          waterafstotende_voeg_included?: boolean
        }
        Update: {
          base_bathroom_price?: number
          base_kitchen_price?: number
          base_m2_price?: number
          chape_primer_included?: boolean
          created_at?: string
          cutting_loss_percentage?: number | null
          discount_percentage?: number
          floor_heating_surcharge?: number | null
          id?: string
          kit_included?: boolean
          lijm_included?: boolean
          minimum_price?: number | null
          ontkoppelingsmat_included?: boolean
          plinth_price_per_meter?: number | null
          price_info_text?: string
          tile_on_tile_surcharge?: number | null
          updated_at?: string
          vloerverwarming_included?: boolean
          voegmiddel_included?: boolean
          waterafstotende_voeg_included?: boolean
        }
        Relationships: []
      }
      project_types: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          key: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          key: string
          name: string
          sort_order: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      quick_calculator_tiles: {
        Row: {
          created_at: string | null
          id: string
          label: string
          price_per_sqm: number
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          price_per_sqm: number
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          price_per_sqm?: number
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      recovery_codes: {
        Row: {
          admin_email: string
          code: string
          contact_email: string
          contact_phone: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          admin_email: string
          code: string
          contact_email: string
          contact_phone: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          admin_email?: string
          code?: string
          contact_email?: string
          contact_phone?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_pages: {
        Row: {
          configtype: string
          created_at: string
          description: string
          details: string
          id: string
          image: string
          route: string
          title: string
          updated_at: string
        }
        Insert: {
          configtype: string
          created_at?: string
          description: string
          details: string
          id?: string
          image: string
          route: string
          title: string
          updated_at?: string
        }
        Update: {
          configtype?: string
          created_at?: string
          description?: string
          details?: string
          id?: string
          image?: string
          route?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          linkurl: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string
          id?: string
          linkurl: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          linkurl?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tile_examples: {
        Row: {
          created_at: string
          description: string
          featured: boolean | null
          finish: string | null
          id: string
          image: string
          name: string
          price_per_sqm: number | null
          size: string
          suitable_for: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          featured?: boolean | null
          finish?: string | null
          id?: string
          image: string
          name: string
          price_per_sqm?: number | null
          size: string
          suitable_for?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          featured?: boolean | null
          finish?: string | null
          id?: string
          image?: string
          name?: string
          price_per_sqm?: number | null
          size?: string
          suitable_for?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      tile_selector_questions: {
        Row: {
          created_at: string
          id: string
          options: Json
          question: string
          question_number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          options?: Json
          question: string
          question_number: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          options?: Json
          question?: string
          question_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      tile_sizes: {
        Row: {
          created_at: string
          id: string
          name: string
          price_multiplier: number
          size_id: string
          tile_type_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price_multiplier?: number
          size_id: string
          tile_type_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price_multiplier?: number
          size_id?: string
          tile_type_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tile_sizes_tile_type_id_fkey"
            columns: ["tile_type_id"]
            isOneToOne: false
            referencedRelation: "tile_types"
            referencedColumns: ["id"]
          },
        ]
      }
      tile_styles: {
        Row: {
          created_at: string
          id: string
          name: string
          price_multiplier: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price_multiplier?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price_multiplier?: number
          updated_at?: string
        }
        Relationships: []
      }
      tile_types: {
        Row: {
          base_price: number
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          base_price: number
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      visit_options: {
        Row: {
          created_at: string
          description: string | null
          field_name: string
          id: string
          is_active: boolean
          name: string
          project_type: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          field_name: string
          id?: string
          is_active?: boolean
          name: string
          project_type: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          field_name?: string
          id?: string
          is_active?: boolean
          name?: string
          project_type?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_options_project_type_fkey"
            columns: ["project_type"]
            isOneToOne: false
            referencedRelation: "project_types"
            referencedColumns: ["key"]
          },
        ]
      }
      wall_tile_sizes: {
        Row: {
          created_at: string
          id: string
          name: string
          price_multiplier: number
          size_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price_multiplier?: number
          size_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price_multiplier?: number
          size_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      wall_types: {
        Row: {
          created_at: string
          id: string
          name: string
          price_multiplier: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price_multiplier?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price_multiplier?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { user_id: string; role: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
