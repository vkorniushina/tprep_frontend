import styles from './Pagination.module.scss';
import arrow from '../../assets/images/arrow_left.svg';

const Pagination = ({ page, totalPages, onPageChange }) => {

    const getPaginationItems = () => {
        const items = [];
        const lastPage = totalPages - 1;

        if (totalPages <= 5) {
            for (let i = 0; i < totalPages; i++) {
                items.push(i);
            }
            return items;
        }

        if (page <= 2) {
            items.push(0, 1, 2, 3);
            items.push('dots');
            items.push(lastPage);
            return items;
        }

        if (page >= lastPage - 2) {
            items.push(0);
            items.push('dots');
            for (let i = lastPage - 3; i <= lastPage; i++) {
                items.push(i);
            }
            return items;
        }

        items.push(0);
        items.push('dots');
        items.push(page - 1, page, page + 1);
        items.push('dots');
        items.push(lastPage);

        return items;
    };

    if (totalPages <= 1) return null;

    return (
        <div className={styles.pagination}>
            <button
                className={styles.arrow}
                disabled={page === 0}
                onClick={() => onPageChange(page - 1)}
            >
                <img src={arrow} alt="Previous" />
            </button>

            {getPaginationItems().map((item, index) =>
                item === 'dots' ? (
                    <span key={`dots-${index}`} className={styles.dots}>…</span>
                ) : (
                    <button
                        key={item}
                        className={`${styles.page} ${item === page ? styles.active : ''}`}
                        onClick={() => onPageChange(item)}
                    >
                        {item + 1}
                    </button>
                )
            )}

            <button
                className={styles.arrow}
                disabled={page === totalPages - 1}
                onClick={() => onPageChange(page + 1)}
            >
                <img src={arrow} className={styles.arrowRight} alt="Next" />
            </button>
        </div>
    );
};

export default Pagination;
