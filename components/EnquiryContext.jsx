'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Shared open/close state for the Quick Enquiry dialog. The dialog itself is
// still rendered by the Header (its position in the page is unchanged); this
// only lets other components, such as the sticky action bar, open it.
const EnquiryContext = createContext({ open: false, source: null, openEnquiry: () => {}, closeEnquiry: () => {} });

export function EnquiryProvider({ children }) {
  const [state, setState] = useState({ open: false, source: null });

  const openEnquiry = useCallback((source = 'unknown') => setState({ open: true, source }), []);
  const closeEnquiry = useCallback(() => setState((current) => ({ ...current, open: false })), []);

  const value = useMemo(
    () => ({ open: state.open, source: state.source, openEnquiry, closeEnquiry }),
    [state, openEnquiry, closeEnquiry],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  return useContext(EnquiryContext);
}
