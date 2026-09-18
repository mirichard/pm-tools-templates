/**
 * Business Object Model
 *
 * Implements Definition 3 from Li & Zheng (2025):
 * BO = (N, Att, S_allowed, M, C)
 *
 * Business objects are the central semantic anchor connecting:
 * - UCS steps to activity diagram object nodes
 * - UCS steps to state machine states
 * - Different levels of requirement abstraction
 */

class BusinessObject {
  /**
   * @param {string} name - N: unique name (e.g., 'Order', 'Shopping Cart')
   * @param {string[]} attributes - Att: structural properties
   * @param {string[]} allowedStates - S_allowed: finite set of permitted states
   * @param {string[]} methods - M: associated methods/actions
   * @param {string[]} constraints - C: business constraints
   */
  constructor(name, attributes = [], allowedStates = [], methods = [], constraints = []) {
    this.name = name;
    this.attributes = attributes;
    this.allowedStates = allowedStates;
    this.methods = methods;
    this.constraints = constraints;
  }

  /**
   * Validate that a given state is in S_allowed
   */
  isValidState(state) {
    return this.allowedStates.length === 0 || this.allowedStates.includes(state);
  }

  /**
   * Create from a plain object (e.g., parsed from JSON)
   */
  static fromJSON(obj) {
    return new BusinessObject(
      obj.name,
      obj.attributes || [],
      obj.allowedStates || [],
      obj.methods || [],
      obj.constraints || []
    );
  }

  toJSON() {
    return {
      name: this.name,
      attributes: this.attributes,
      allowedStates: this.allowedStates,
      methods: this.methods,
      constraints: this.constraints,
    };
  }
}

/**
 * Registry for managing business objects across a project.
 * Supports the type system T from Definition 4.
 */
class BusinessObjectRegistry {
  constructor() {
    /** @type {Map<string, BusinessObject>} */
    this.objects = new Map();
  }

  register(bo) {
    this.objects.set(bo.name, bo);
  }

  get(name) {
    return this.objects.get(name) || null;
  }

  has(name) {
    return this.objects.has(name);
  }

  getAll() {
    return Array.from(this.objects.values());
  }

  getAllNames() {
    return Array.from(this.objects.keys());
  }

  /**
   * Build registry from an array of BO definitions
   */
  static fromArray(boArray) {
    const registry = new BusinessObjectRegistry();
    for (const obj of boArray) {
      registry.register(BusinessObject.fromJSON(obj));
    }
    return registry;
  }

  toJSON() {
    return this.getAll().map((bo) => bo.toJSON());
  }
}

module.exports = { BusinessObject, BusinessObjectRegistry };
