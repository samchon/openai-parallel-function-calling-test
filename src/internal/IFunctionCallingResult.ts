import { AutoBePrisma } from "./AutoBePrisma";

export interface IFunctionCallingResult {
  /**
   * STEP 1: First enumeration of tables that must be created
   *
   * List all table names that need to be created based on the
   * `targetComponent.tables`. This should be an exact copy of the
   * `targetComponent.tables` array.
   *
   * Example: ["shopping_goods", "shopping_goods_options"]
   */
  tablesToCreate: string[];

  /**
   * STEP 2: Validation review of the first enumeration
   *
   * Compare `tablesToCreate` against `targetComponent.tables` and
   * `otherComponents[].tables`. Write a review statement that validates:
   *
   * - All tables from `targetComponent.tables` are included
   * - No tables from `otherComponents[].tables` are included
   * - Additional tables (if any) are for M:N junction relationships or
   *   domain-specific needs
   * - No forbidden tables from other domains are included
   *
   * Example: "VALIDATION PASSED: All required tables from
   * `targetComponent.tables` included: shopping_goods, shopping_goods_options.
   * FORBIDDEN CHECK: No tables from `otherComponents` included
   * (shopping_customers, shopping_sellers are correctly excluded). Additional
   * tables: none needed for this domain."
   */
  validationReview: string;

  /**
   * STEP 3: Second enumeration of tables to create
   *
   * After validation, re-list the tables that will be created. This should be
   * identical to `tablesToCreate` if validation passed. This serves as the
   * final confirmed list before model creation.
   *
   * Example: ["shopping_goods", "shopping_goods_options"]
   */
  confirmedTables: string[];

  /**
   * STEP 4: Array of Prisma models (database tables) within the domain
   *
   * Create exactly one model for each table in `confirmedTables`. Each model
   * represents a business entity or concept within the namespace. Models can
   * reference each other through foreign key relationships.
   *
   * The `models` array length must equal `confirmedTables.length`. Each
   * `model.name` must match an entry in `confirmedTables`.
   */
  models: AutoBePrisma.IModel[];
}
