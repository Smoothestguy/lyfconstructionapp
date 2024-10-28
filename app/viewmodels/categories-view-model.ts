import { Frame, Observable } from '@nativescript/core';
import { categories, ServiceCategory } from '../models/service.model';

export class CategoriesViewModel extends Observable {
    private _categories: ServiceCategory[];
    private _searchQuery: string = '';

    constructor() {
        super();
        this._categories = categories;
    }

    get categories(): ServiceCategory[] {
        return this._categories;
    }

    get searchQuery(): string {
        return this._searchQuery;
    }

    set searchQuery(value: string) {
        if (this._searchQuery !== value) {
            this._searchQuery = value;
            this.notifyPropertyChange('searchQuery', value);
            this.filterCategories();
        }
    }

    onSearch() {
        this.filterCategories();
    }

    onClearSearch() {
        this.searchQuery = '';
    }

    private filterCategories() {
        if (!this._searchQuery) {
            this._categories = categories;
        } else {
            const query = this._searchQuery.toLowerCase();
            this._categories = categories.filter(category => 
                category.name.toLowerCase().includes(query) ||
                category.description.toLowerCase().includes(query)
            );
        }
        this.notifyPropertyChange('categories', this._categories);
    }

    onCategorySelect(args: any) {
        const index = args.index;
        const category = this._categories[index];
        Frame.topmost().navigate({
            moduleName: 'views/services-page',
            context: { category }
        });
    }

    onProfile() {
        // Handle profile navigation
        console.log('Profile tapped');
    }
}