// Pagination.tsx

import React from 'react';
import styled from 'styled-components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button<{ isActive: boolean }>`
  padding: 8px 12px;
  margin: 0 4px;
  background-color: ${(props) => (props.isActive ? '#007BFF' : '#fff')};
  color: ${(props) => (props.isActive ? '#fff' : '#007BFF')};
  border: 1px solid #007BFF;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isActive ? '#0056b3' : '#f2f2f2')};
  }
`;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <PageButton
          key={i}
          isActive={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </PageButton>
      );
    }
    return buttons;
  };

  return (
    <PaginationWrapper>
      {renderPageButtons()}
    </PaginationWrapper>
  );
};

export default Pagination;
