
# NieuweVloer.be Web Application

## Architecture Overview

This project follows a component-based architecture with React and TypeScript. It's built to provide a user-friendly configurator for tile installation quotes with a focus on maintainability and modularity.

### Key Architecture Decisions

- **Service Layer Pattern**: All data operations are abstracted into service files
- **Context API for State Management**: Using React Context for shared state
- **Component Composition**: Building complex UIs from smaller, focused components
- **Custom Hooks**: Encapsulating logic for reusability

## Directory Structure

The codebase is organized as follows:

- `/src/components`: UI components grouped by feature
- `/src/contexts`: React Context providers for global state
- `/src/hooks`: Custom React hooks
- `/src/services`: Data services for API operations
- `/src/utils`: Utility functions and helpers
- `/src/types`: TypeScript type definitions
- `/src/integrations`: External integrations (e.g., Supabase)

## Development Guidelines

### Adding New Features

1. **Service Layer First**: Add data operations to appropriate service files
2. **Create/Modify Types**: Update TypeScript interfaces as needed
3. **Build UI Components**: Create focused, small components
4. **Connect State**: Use contexts or hooks for state management

### Best Practices

- Keep components small and focused
- Extract reusable logic into custom hooks
- Use services for all API calls
- Follow consistent naming conventions
- Document complex logic

## Key Features

- Tile installation configurator
- Price calculator
- Contact request forms
- Admin dashboard for managing configurations

## Contact

For questions about the architecture or codebase, please contact the development team.

