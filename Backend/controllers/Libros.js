export class Libros {
  constructor(model) {
    this.model = model;
  }

  async getLibros() {
    return await this.model.getLibros();
  }

  async getLibrosFilter(filters = {}) {
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (
        value === '' ||
        value === 'false' ||
        value === false ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return acc;
      }

      if (key === 'genre') {
        acc[key] = Array.isArray(value) ? value : [value];
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});

    return await this.model.getLibrosFilter(cleanFilters);
  }

  async getLibrosByName(name) {
    return await this.model.getLibrosByName(name);
  }

  async createLibro(data) {
    return await this.model.createLibro(data);
  }

  async updateLibroforId(data, id) {
    return await this.model.updateLibro(data, id);
  }

  async replaceLibro(data, id) {
    return await this.model.replaceLibro(data, id);
  }

  async deleteLibro(id) {
    return await this.model.deleteLibro(id);
  }
}
