import { fireEvent, render, screen } from '@testing-library/react';

import StarRating from '@/components/ui/StarRating';

it('should render 5 stars with blue color if rating = 5', () => {
    // Arrange
    const rating = 5;
    const setRating = jest.fn();
    const showHeader = true;
    const bigStars = true;

    // Act
    const { container } = render(
        <StarRating
            rating={rating}
            setRating={setRating}
            showHeader={showHeader}
            bigStars={bigStars}
        />,
    );

    // Assert
    const starIcons = container.querySelectorAll('svg');
    expect(starIcons).toHaveLength(5);
    starIcons.forEach(icon => {
        expect(icon).toHaveClass('fill-blue');
    });
});
it('should set the rating to the corresponding value when clicking on a star icon', () => {
    // Arrange
    const rating = 2;
    const setRating = jest.fn();
    const showHeader = true;
    const bigStars = true;

    // Act
    const { container } = render(
        <StarRating
            rating={rating}
            setRating={setRating}
            showHeader={showHeader}
            bigStars={bigStars}
        />,
    );

    const starIcons = container.querySelectorAll('svg');
    fireEvent.click(starIcons[2]);

    expect(setRating).toHaveBeenCalledWith(3);
});
