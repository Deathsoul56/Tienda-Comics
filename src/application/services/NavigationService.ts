export type ViewType = 'home' | 'catalogo' | 'ventas' | 'carrito';

export class NavigationService {
  private static instance: NavigationService;
  private currentView: ViewType = 'home';
  private listeners: ((view: ViewType) => void)[] = [];

  private constructor() {
    // Listen for custom navigation events
    window.addEventListener('changeVista', ((e: CustomEvent) => {
      if (['home', 'catalogo', 'ventas', 'carrito'].includes(e.detail)) {
        this.navigateTo(e.detail);
      }
    }) as EventListener);
  }

  public static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  public navigateTo(view: ViewType): void {
    this.currentView = view;
    this.notifyListeners(view);
    
    // Dispatch event for backwards compatibility
    window.dispatchEvent(new CustomEvent('navigationChange', { detail: view }));
  }

  public getCurrentView(): ViewType {
    return this.currentView;
  }

  public subscribe(listener: (view: ViewType) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(view: ViewType): void {
    this.listeners.forEach(listener => listener(view));
  }
}

export const navigationService = NavigationService.getInstance();